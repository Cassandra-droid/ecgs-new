"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Star,
  StarHalf,
  Briefcase,
  ArrowRight,
  TrendingUp,
  Award,
  BarChart,
  ExternalLink,
  Loader2,
} from "lucide-react"

// Interface for a skill entry
interface SkillEntry {
  id: number
  name: string
  type: string
  score: number
}

// Interface for career data
interface Career {
  id: number
  career: string
  category: string
  requiredskills: string[] // Note: lowercase from PostgreSQL JSON column
  keywords: string[]
}

// Interface for assessment results
interface AssessmentResults {
  percentageScores: Record<string, number>
  strongSkills: SkillEntry[]
  skillsToImprove: SkillEntry[]
  missingSkills: {
    skill: string
    resourceType: string
    link: string
  }[]
  careerRecommendations: {
    career: string
    matchPercentage: number
    requiredSkills: string[]
  }[]
}

// Interface for learning resources from your API
interface LearningResource {
  // Update these fields to match your API's response format
  id: number
  skillName: string // or whatever field name your API uses
  resourceType: string
  url: string
  description?: string
}

export default function ResultsPage() {
  const [assessmentData, setAssessmentData] = useState<{ skills: SkillEntry[] } | null>(null)
  const [careers, setCareers] = useState<Career[]>([])
  const [allSkills, setAllSkills] = useState<{ id: number; name: string; type: string }[]>([])
  const [learningResources, setLearningResources] = useState<LearningResource[]>([])
  const [results, setResults] = useState<AssessmentResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

 
  // Process the assessment data to generate results
  const processAssessmentData = (skills: SkillEntry[], careers: Career[]) => {
    try {
      // Calculate percentage scores by skill type
      const percentageScores = calculatePercentageScores(skills)

      // Categorize skills
      const { strongSkills, skillsToImprove, missingSkills } = categorizeSkills(skills, careers)

      // Generate career recommendations
      const careerRecommendations = generateCareerRecommendations(skills, careers)

      setResults({
        percentageScores,
        strongSkills,
        skillsToImprove,
        missingSkills,
        careerRecommendations,
      })

      setLoading(false)
    } catch (error) {
      console.error("Error processing assessment data:", error)
      setError("Failed to process assessment data. Please try again.")
      setLoading(false)
    }
  }
 useEffect(() => {
    const fetchData = async () => {
      try {
        // Get assessment data from localStorage
        const storedData = localStorage.getItem("assessmentData")

        if (!storedData) {
          setError("No assessment data found. Please complete the assessment first.")
          setLoading(false)
          return
        }

        // Parse assessment data
        const parsedData = JSON.parse(storedData) as { skills: SkillEntry[] }
        setAssessmentData(parsedData)

        // Fetch careers from API
        const careersResponse = await fetch("/api/careers")
        if (!careersResponse.ok) {
          throw new Error("Failed to fetch careers data")
        }
        const careersData = await careersResponse.json()
        setCareers(careersData)

        // Fetch all skills for reference
        const skillsResponse = await fetch("/api/skills")
        if (!skillsResponse.ok) {
          throw new Error("Failed to fetch skills data")
        }
        const skillsData = await skillsResponse.json()
        setAllSkills(skillsData)

        // Fetch learning resources from your existing API
        try {
          const resourcesResponse = await fetch("/api/recommend-learning/")
          if (resourcesResponse.ok) {
            const resourcesData = await resourcesResponse.json()
            setLearningResources(resourcesData)
          }
        } catch (e) {
          console.warn("Learning resources not available:", e)
          // Continue without learning resources
        }

        // Process the assessment data to generate results
        processAssessmentData(parsedData.skills, careersData)
      } catch (e) {
        console.error("Error processing assessment data:", e)
        setError("Failed to process assessment results. Please try again.")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate percentage scores by skill type
  const calculatePercentageScores = (skills: SkillEntry[]): Record<string, number> => {
    // Group skills by type
    const skillsByType: Record<string, SkillEntry[]> = {}
    skills.forEach((skill) => {
      if (!skillsByType[skill.type]) {
        skillsByType[skill.type] = []
      }
      skillsByType[skill.type].push(skill)
    })

    // Calculate average score for each type
    const percentageScores: Record<string, number> = {}
    Object.entries(skillsByType).forEach(([type, typeSkills]) => {
      const totalScore = typeSkills.reduce((sum, skill) => sum + skill.score, 0)
      const averageScore = (totalScore / typeSkills.length) * 20 // Convert to percentage (0-100)
      percentageScores[type] = Math.round(averageScore)
    })

    return percentageScores
  }

  // Categorize skills into strong skills, skills to improve, and missing skills
  const categorizeSkills = (
    skills: SkillEntry[],
    careers: Career[],
  ): {
    strongSkills: SkillEntry[]
    skillsToImprove: SkillEntry[]
    missingSkills: { skill: string; resourceType: string; link: string }[]
  } => {
    // Categorize skills based on score
    const strongSkills = skills.filter((skill) => skill.score >= 4)
    const skillsToImprove = skills.filter((skill) => skill.score < 4)

    // Generate missing skills based on the user's skills and career gaps
    const missingSkills = generateMissingSkills(skills, careers)

    return { strongSkills, skillsToImprove, missingSkills }
  }

  // Generate missing skills based on the user's skills and career gaps
  const generateMissingSkills = (
    skills: SkillEntry[],
    careers: Career[],
  ): { skill: string; resourceType: string; link: string }[] => {
    // Get all user skills as lowercase for matching
    const userSkillsLower = skills.map((skill) => skill.name.toLowerCase())

    // Get top career recommendations
    const careerRecommendations = generateCareerRecommendations(skills, careers).slice(0, 3)

    // Find missing skills from top career recommendations
    const missingSkillsSet = new Set<string>()

    careerRecommendations.forEach((career) => {
      const careerObj = careers.find((c) => c.career === career.career)
      if (careerObj) {
        // Get required skills that the user doesn't have
        const requiredSkills = careerObj.requiredskills || []
        requiredSkills.forEach((skill) => {
          const skillLower = skill.toLowerCase()
          if (!userSkillsLower.some((userSkill) => userSkill.includes(skillLower) || skillLower.includes(userSkill))) {
            missingSkillsSet.add(skill)
          }
        })
      }
    })

    // Convert to array and limit to 3 skills
    const missingSkillsArray = Array.from(missingSkillsSet).slice(0, 3)

    // Get learning resources for missing skills
    return missingSkillsArray.map((skill) => {
      const resource = getLearningResource(skill)
      return {
        skill,
        resourceType: resource.resourceType,
        link: resource.link,
      }
    })
  }

  // Generate career recommendations based on skills
  const generateCareerRecommendations = (
    skills: SkillEntry[],
    careers: Career[],
  ): {
    career: string
    matchPercentage: number
    requiredSkills: string[]
  }[] => {
    // Get all user skills as lowercase for matching
    const userSkillsLower = skills.map((skill) => skill.name.toLowerCase())

    // Get strong skills (score >= 4)
    const strongSkills = skills.filter((skill) => skill.score >= 4)
    const strongSkillsLower = strongSkills.map((skill) => skill.name.toLowerCase())

    // Calculate match scores for each career
    const careerMatches = careers.map((career) => {
      // Calculate keyword match score
      let keywordMatches = 0
      const keywords = career.keywords || []
      keywords.forEach((keyword) => {
        if (userSkillsLower.some((skill) => skill.includes(keyword) || keyword.includes(skill))) {
          keywordMatches++
        }
      })
      const keywordMatchScore = keywords.length > 0 ? keywordMatches / keywords.length : 0

      // Calculate required skills match score
      let requiredSkillMatches = 0
      const requiredSkills = career.requiredskills || []
      requiredSkills.forEach((requiredSkill) => {
        const requiredSkillLower = requiredSkill.toLowerCase()
        if (
          strongSkillsLower.some((skill) => skill.includes(requiredSkillLower) || requiredSkillLower.includes(skill))
        ) {
          requiredSkillMatches++
        }
      })
      const requiredSkillMatchScore = requiredSkills.length > 0 ? requiredSkillMatches / requiredSkills.length : 0

      // Calculate category match score
      // Find the user's skill count by category
      const userSkillsByCategory: Record<string, number> = {}
      skills.forEach((skill) => {
        userSkillsByCategory[skill.type] = (userSkillsByCategory[skill.type] || 0) + 1
      })

      // Find the user's strongest category
      let strongestCategory = ""
      let maxSkillCount = 0
      Object.entries(userSkillsByCategory).forEach(([category, count]) => {
        if (count > maxSkillCount) {
          maxSkillCount = count
          strongestCategory = category
        }
      })

      // Calculate category match (1 if matches, 0.5 if not)
      const categoryMatchScore = career.category === strongestCategory ? 1 : 0.5

      // Calculate final match percentage (weighted average)
      const matchPercentage = Math.round(
        (keywordMatchScore * 0.4 + requiredSkillMatchScore * 0.4 + categoryMatchScore * 0.2) * 100,
      )

      return {
        career: career.career,
        matchPercentage: matchPercentage,
        requiredSkills: requiredSkills,
      }
    })

    // Sort by match percentage and take top 5
    return careerMatches.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 5)
  }

  // Get learning resources for a skill
  const getLearningResource = (skillName: string): { resourceType: string; link: string } => {
    // First check if we have a resource from your API
    if (learningResources.length > 0) {
      const matchingResource = learningResources.find(
        (resource) => resource.skillName.toLowerCase() === skillName.toLowerCase(),
      )

      if (matchingResource) {
        return {
          resourceType: matchingResource.resourceType,
          link: matchingResource.url,
        }
      }
    }

    // Fallback to hardcoded resources if not found in database
    const skillToResourceMap: Record<string, { resourceType: string; link: string }> = {
      // Technical Skills
      JavaScript: { resourceType: "Interactive Course", link: "https://www.w3schools.com/js/default.asp" },
      "Python Programming": {
        resourceType: "Online Course",
        link: "https://www.udemy.com/course/complete-python-bootcamp/",
      },
      React: { resourceType: "Documentation", link: "https://react.dev/learn" },
      "HTML/CSS": { resourceType: "Tutorial", link: "https://www.w3schools.com/html/" },
      SQL: { resourceType: "Interactive Learning", link: "https://www.sqlzoo.net/" },
      "Machine Learning": { resourceType: "Course", link: "https://www.coursera.org/learn/machine-learning" },
      "Data Analysis": { resourceType: "Tutorial", link: "https://www.kaggle.com/learn/data-visualization" },

      // Soft Skills
      Communication: { resourceType: "Course", link: "https://www.coursera.org/learn/communication-skills" },
      Leadership: { resourceType: "Course", link: "https://www.coursera.org/learn/leadership-skills" },
      Teamwork: { resourceType: "Article", link: "https://www.mindtools.com/pages/article/newTMM_53.htm" },

      // Find skill type from our skills database
      ...Object.fromEntries(
        allSkills.map((skill) => [
          skill.name,
          {
            resourceType: getResourceTypeForSkillType(skill.type),
            link: getDefaultLinkForSkillType(skill.type, skill.name),
          },
        ]),
      ),
    }

    // Check if we have a specific resource for this skill
    if (skillName in skillToResourceMap) {
      return skillToResourceMap[skillName]
    }

    // Get skill type if possible
    const skillType =
      allSkills.find((s) => s.name.toLowerCase() === skillName.toLowerCase())?.type || "Technical Skills"

    // Fallback resources by skill type
    return {
      resourceType: getResourceTypeForSkillType(skillType),
      link: getDefaultLinkForSkillType(skillType, skillName),
    }
  }

  // Helper function to get resource type based on skill type
  const getResourceTypeForSkillType = (skillType: string): string => {
    const resourceTypes: Record<string, string> = {
      "Technical Skills": "Online Course",
      "Soft Skills": "Workshop",
      "Management Skills": "Leadership Training",
      "Analytical Skills": "Data Analysis Course",
      "Creative Skills": "Design Tutorial",
      "Domain Knowledge": "Industry Guide",
    }

    return resourceTypes[skillType] || "Learning Resource"
  }

  // Helper function to get default link based on skill type
  const getDefaultLinkForSkillType = (skillType: string, skillName: string): string => {
    const defaultLinks: Record<string, string> = {
      "Technical Skills": "https://www.udemy.com/courses/development/",
      "Soft Skills": "https://www.coursera.org/browse/personal-development",
      "Management Skills": "https://www.mindtools.com/",
      "Analytical Skills": "https://www.datacamp.com/",
      "Creative Skills": "https://www.skillshare.com/",
      "Domain Knowledge": "https://www.edx.org/",
    }

    // Create a search query for the skill
    const searchQuery = encodeURIComponent(skillName)
    const baseLink = defaultLinks[skillType] || "https://www.coursera.org/"

    // For some platforms, we can add the search query
    if (baseLink.includes("udemy") || baseLink.includes("coursera")) {
      return `${baseLink}search?q=${searchQuery}`
    }

    return baseLink
  }

  if (loading) {
    return (
      <div className="container max-w-4xl py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <h2 className="text-2xl font-semibold">Analyzing your skills...</h2>
          <p className="text-muted-foreground">Our AI model is processing your skill assessment</p>
        </div>
      </div>
    )
  }

  if (error || !results || !assessmentData) {
    return (
      <div className="container max-w-4xl py-12">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-2">
              <AlertTriangle className="h-12 w-12 text-destructive" />
              <h2 className="text-2xl font-semibold">Error</h2>
              <p className="text-muted-foreground">{error || "Failed to process assessment results."}</p>
              <div className="mt-4">
                <Button asChild>
                  <Link href="/assessment">Take Assessment</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8 space-y-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Assessment Results</h1>
        </div>
        <p className="text-muted-foreground">
          Based on your skills and proficiency levels, we&apos;ve analyzed your profile and prepared personalized
          recommendations.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
          <TabsTrigger value="learning">Learning Recommendations</TabsTrigger>
          <TabsTrigger value="careers">Career Paths</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* Skill Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">{assessmentData.skills.length}</h3>
                  <p className="text-sm text-muted-foreground">Total Skills Assessed</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center rounded-full bg-green-500/10 p-3 mb-4">
                    <Star className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold">{results.strongSkills.length}</h3>
                  <p className="text-sm text-muted-foreground">Strong Skills</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center rounded-full bg-amber-500/10 p-3 mb-4">
                    <TrendingUp className="h-6 w-6 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-bold">{results.skillsToImprove.length}</h3>
                  <p className="text-sm text-muted-foreground">Skills to Improve</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skill Proficiency by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Proficiency by Category</CardTitle>
              <CardDescription>Your skill proficiency scores across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(results.percentageScores).map(([category, score]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{category}</span>
                      <span>{score}%</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Your Top Skills</CardTitle>
              <CardDescription>Skills where you demonstrate high proficiency</CardDescription>
            </CardHeader>
            <CardContent>
              {results.strongSkills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.strongSkills.slice(0, 4).map((skill) => (
                    <div key={skill.name} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                      <div className="mt-0.5">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{skill.name}</h3>
                        <p className="text-sm text-muted-foreground">{skill.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No strong skills identified yet. Keep improving!</p>
              )}
            </CardContent>
          </Card>

          {/* Career Recommendations Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Career Recommendations</CardTitle>
              <CardDescription>Based on your strongest skills, these career paths might be a good fit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.careerRecommendations.slice(0, 3).map((career) => (
                  <div key={career.career} className="flex justify-between items-center p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span className="font-medium">{career.career}</span>
                    </div>
                    <Badge className="bg-primary">{career.matchPercentage}% Match</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STRENGTHS TAB */}
        <TabsContent value="strengths" className="space-y-6">
          {/* Strong Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Your Strengths</CardTitle>
              <CardDescription>Skills where you demonstrate high proficiency</CardDescription>
            </CardHeader>
            <CardContent>
              {results.strongSkills.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {results.strongSkills.map((skill) => (
                    <div key={skill.name} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{skill.name}</h3>
                        <div className="mt-1 flex items-center">
                          <p className="text-sm text-muted-foreground mr-2">{skill.type}</p>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => {
                              if (i < Math.floor(skill.score)) {
                                return <Star key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />
                              } else if (i < skill.score) {
                                return <StarHalf key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />
                              } else {
                                return <Star key={i} className="h-3 w-3 text-muted-foreground" />
                              }
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <BarChart className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-semibold">No Strong Skills Yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                    Continue developing your skills to reach advanced or expert level proficiency.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skill Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Distribution</CardTitle>
              <CardDescription>Breakdown of your skills by category and proficiency level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Skill Categories */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Skills by Category</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(
                      assessmentData.skills.reduce(
                        (acc, skill) => {
                          acc[skill.type] = (acc[skill.type] || 0) + 1
                          return acc
                        },
                        {} as Record<string, number>,
                      ),
                    ).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center p-3 rounded-lg border">
                        <span>{type}</span>
                        <Badge variant="outline">{count} skills</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proficiency Levels */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Skills by Proficiency Level</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg border bg-green-500/5 border-green-500/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-green-600">Expert (4.5-5)</span>
                        <Badge variant="outline" className="border-green-500/30">
                          {assessmentData.skills.filter((s) => s.score >= 4.5).length}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Skills where you have mastery</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-blue-500/5 border-blue-500/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-blue-600">Advanced (3.5-4)</span>
                        <Badge variant="outline" className="border-blue-500/30">
                          {assessmentData.skills.filter((s) => s.score >= 3.5 && s.score < 4.5).length}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Skills where you&apos;re highly proficient</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-amber-500/5 border-amber-500/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-amber-600">Intermediate (2.5-3)</span>
                        <Badge variant="outline" className="border-amber-500/30">
                          {assessmentData.skills.filter((s) => s.score >= 2.5 && s.score < 3.5).length}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Skills where you have good knowledge</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LEARNING RECOMMENDATIONS TAB */}
        <TabsContent value="learning" className="space-y-6">
          {/* Skills to Improve */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-amber-500/10 to-transparent">
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-amber-500" />
                Skills to Improve
              </CardTitle>
              <CardDescription>
                Skills where you have some proficiency but could benefit from additional training
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {results.skillsToImprove.length > 0 ? (
                <div className="space-y-4">
                  {results.skillsToImprove.map((skill) => {
                    const resource = getLearningResource(skill.name)
                    return (
                      <Card key={skill.name} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">{skill.name}</h3>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => {
                                if (i < Math.floor(skill.score)) {
                                  return <Star key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />
                                } else if (i < skill.score) {
                                  return <StarHalf key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />
                                } else {
                                  return <Star key={i} className="h-3 w-3 text-muted-foreground" />
                                }
                              })}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">Category: {skill.type}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-2 text-primary" />
                              <span className="text-sm">{resource.resourceType}</span>
                            </div>
                            <Button size="sm" variant="outline" asChild>
                              <a
                                href={resource.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                              >
                                Start Learning <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground py-4">No skills in this category. Great job!</p>
              )}
            </CardContent>
          </Card>

          {/* Missing Skills */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-transparent">
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                Skills to Acquire
              </CardTitle>
              <CardDescription>
                Based on your career interests, these are skills you should consider developing
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {results.missingSkills.length > 0 ? (
                <div className="space-y-4">
                  {results.missingSkills.map((skill) => (
                    <Card key={skill.skill} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold">{skill.skill}</h3>
                          <Badge variant="outline">New Skill</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          This skill is required for several of your recommended career paths
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-sm">{skill.resourceType}</span>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <a
                              href={skill.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center"
                            >
                              Start Learning <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground py-4">No missing skills identified for your career interests.</p>
              )}
            </CardContent>
          </Card>

          {/* Learning Path */}
          <Card>
            <CardHeader>
              <CardTitle>Your Learning Path</CardTitle>
              <CardDescription>A structured approach to developing your skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="relative pl-8 pb-8 border-l-2 border-muted">
                  <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary"></div>
                  <h3 className="font-semibold">Start with Fundamentals</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Begin by strengthening your foundation in these areas:
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {results.skillsToImprove
                      .filter((s) => s.score < 3)
                      .slice(0, 2)
                      .map((skill) => (
                        <Badge key={skill.name} variant="outline">
                          {skill.name}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className="relative pl-8 pb-8 border-l-2 border-muted">
                  <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary"></div>
                  <h3 className="font-semibold">Improve Existing Skills</h3>
                  <p className="text-sm text-muted-foreground mt-1">Next, focus on enhancing your current skillset:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {results.skillsToImprove
                      .filter((s) => s.score >= 3)
                      .slice(0, 3)
                      .map((skill) => (
                        <Badge key={skill.name} variant="outline">
                          {skill.name}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className="relative pl-8">
                  <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary"></div>
                  <h3 className="font-semibold">Expand Your Skillset</h3>
                  <p className="text-sm text-muted-foreground mt-1">Finally, develop expertise in new areas:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {results.missingSkills.map((skill) => (
                      <Badge key={skill.skill} variant="outline">
                        {skill.skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CAREER PATHS TAB */}
        <TabsContent value="careers" className="space-y-6">
          {/* Career Recommendations */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                Career Recommendations
              </CardTitle>
              <CardDescription>Based on your strongest skills, these career paths might be a good fit</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {results.careerRecommendations.map((career, index) => (
                  <Card key={career.career} className={`overflow-hidden ${index === 0 ? "border-primary" : ""}`}>
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">{career.career}</h3>
                        <Badge className={index === 0 ? "bg-primary" : "bg-secondary"}>
                          {career.matchPercentage}% Match
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Required skills:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {career.requiredSkills.map((skill) => (
                          <Badge key={skill} variant="outline" className="mt-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skill Gap Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Gap Analysis</CardTitle>
              <CardDescription>Skills you should develop for your target careers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-semibold mb-2">Priority Skills to Develop</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on your career recommendations, here are the skills you should prioritize:
                </p>

                <div className="space-y-3">
                  {results.careerRecommendations.flatMap((career) => {
                    // Find skills that are required but the user doesn't have
                    const missingRequiredSkills = career.requiredSkills.filter(
                      (skill) =>
                        !results.strongSkills.some(
                          (s) =>
                            s.name.toLowerCase().includes(skill.toLowerCase()) ||
                            skill.toLowerCase().includes(s.name.toLowerCase()),
                        ),
                    )

                    return missingRequiredSkills.map((skill) => {
                      const resource = getLearningResource(skill)
                      return (
                        <div
                          key={`${career.career}-${skill}`}
                          className="flex justify-between items-center p-3 rounded-lg border"
                        >
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-primary" />
                            <div>
                              <span className="font-medium">{skill}</span>
                              <p className="text-xs text-muted-foreground">Required for: {career.career}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">High Priority</Badge>
                            <Button size="sm" variant="ghost" className="h-8" asChild>
                              <a href={resource.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      )
                    })
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Career Growth Path */}
          <Card>
            <CardHeader>
              <CardTitle>Career Growth Path</CardTitle>
              <CardDescription>Steps to advance in your recommended career paths</CardDescription>
            </CardHeader>
            <CardContent>
              {results.careerRecommendations.length > 0 && (
                <div className="space-y-6">
                  <div className="relative pl-8 pb-8 border-l-2 border-muted">
                    <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary"></div>
                    <h3 className="font-semibold">Entry Level</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start with positions like{" "}
                      <span className="font-medium">Junior {results.careerRecommendations[0].career}</span> to build
                      experience.
                    </p>
                    <div className="mt-2">
                      <p className="text-sm">Focus on developing these skills:</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {results.careerRecommendations[0].requiredSkills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative pl-8 pb-8 border-l-2 border-muted">
                    <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary"></div>
                    <h3 className="font-semibold">Mid-Level</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Progress to <span className="font-medium">{results.careerRecommendations[0].career}</span> roles
                      with 2-3 years of experience.
                    </p>
                    <div className="mt-2">
                      <p className="text-sm">Enhance your expertise in:</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {results.careerRecommendations[0].requiredSkills.slice(2).map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative pl-8">
                    <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary"></div>
                    <h3 className="font-semibold">Senior Level</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Advance to <span className="font-medium">Senior {results.careerRecommendations[0].career}</span>{" "}
                      or leadership positions.
                    </p>
                    <div className="mt-2">
                      <p className="text-sm">Develop additional skills like:</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <Badge variant="outline">Team Leadership</Badge>
                        <Badge variant="outline">Strategic Planning</Badge>
                        <Badge variant="outline">Mentoring</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button asChild>
          <Link href="/assessment">Take Another Assessment</Link>
        </Button>
      </div>
    </div>
  )
}
