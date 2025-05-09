"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { updateUserSkills } from "@/lib/profile"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, X, Search, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Predefined skills list with categories
const PREDEFINED_SKILLS = [
  { name: "JavaScript", category: "Programming" },
  { name: "Python", category: "Programming" },
  { name: "React", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "TypeScript", category: "Programming" },
  { name: "HTML/CSS", category: "Frontend" },
  { name: "SQL", category: "Database" },
  { name: "Java", category: "Programming" },
  { name: "C#", category: "Programming" },
  { name: "PHP", category: "Programming" },
  { name: "Ruby", category: "Programming" },
  { name: "Swift", category: "Mobile" },
  { name: "Kotlin", category: "Mobile" },
  { name: "Go", category: "Programming" },
  { name: "Rust", category: "Programming" },
  { name: "AWS", category: "Cloud" },
  { name: "Azure", category: "Cloud" },
  { name: "Docker", category: "DevOps" },
  { name: "Kubernetes", category: "DevOps" },
  { name: "Git", category: "Tools" },
  { name: "Communication", category: "Soft Skills" },
  { name: "Leadership", category: "Soft Skills" },
  { name: "Problem Solving", category: "Soft Skills" },
  { name: "Critical Thinking", category: "Soft Skills" },
  { name: "Teamwork", category: "Soft Skills" },
  { name: "Project Management", category: "Management" },
  { name: "Agile/Scrum", category: "Methodology" },
  { name: "UI/UX Design", category: "Design" },
  { name: "Data Analysis", category: "Data" },
  { name: "Machine Learning", category: "AI" },
]

// Group skills by category
const SKILL_CATEGORIES = PREDEFINED_SKILLS.reduce(
  (acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill.name)
    return acc
  },
  {} as Record<string, string[]>,
)

interface SkillsSectionProps {
  skills: any[]
  onUpdate: () => void
}

export default function SkillsSection({ skills, onUpdate }: SkillsSectionProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [userSkills, setUserSkills] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [customSkill, setCustomSkill] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { toast } = useToast()

  // Initialize user skills from props
  useEffect(() => {
    if (skills && skills.length > 0) {
      // Map skills to the expected format with id and name
      const formattedSkills = skills.map((skill) => ({
        id: skill.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
        name: skill.name,
        level: skill.level || "Intermediate",
      }))
      setUserSkills(formattedSkills)
    }
  }, [skills])

  // Filter skills based on search term
  const filteredSkills = PREDEFINED_SKILLS.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get unique categories
  const categories = Object.keys(SKILL_CATEGORIES).sort()

  const handleAddSkill = (skillName: string) => {
    if (!skillName.trim()) {
      toast({
        title: "Missing skill name",
        description: "Please select or enter a skill name.",
        variant: "destructive",
      })
      return
    }

    // Check if skill already exists
    if (userSkills.some((skill) => skill.name.toLowerCase() === skillName.toLowerCase())) {
      toast({
        title: "Skill already added",
        description: "This skill is already in your profile.",
        variant: "destructive",
      })
      return
    }

    const newSkillObj = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: skillName,
      level: "Intermediate", // Default level
    }

    setUserSkills([...userSkills, newSkillObj])
    setSearchTerm("")
    setCustomSkill("")
    setShowSuggestions(false)
  }

  const handleRemoveSkill = (skillId: string) => {
    setUserSkills(userSkills.filter((skill) => skill.id !== skillId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)

    if (userSkills.length === 0) {
      toast({
        title: "No skills added",
        description: "Please add at least one skill to continue.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      // Extract just the skill names for the API call
      const skillNames = userSkills.map((skill) => skill.name)
      await updateUserSkills(skillNames)

      setSuccess(true)
      toast({
        title: "Skills updated",
        description: "Your skills have been updated successfully.",
      })

      // Wait a moment to show the success state before proceeding
      setTimeout(() => {
        onUpdate()
      }, 1000)
    } catch (error) {
      console.error("Error updating skills:", error)
      toast({
        title: "Update failed",
        description: "There was a problem updating your skills. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Close suggestions when clicking outside - but don't close when clicking inside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // @ts-ignore - we know these elements exist
      const suggestionsElement = document.querySelector(".skills-suggestions")
      const categoryElement = document.querySelector(".skills-categories")

      if (
        suggestionsElement &&
        !suggestionsElement.contains(event.target as Node) &&
        categoryElement &&
        !categoryElement.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Update the category selection to properly show suggestions
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category)
    setShowSuggestions(true)
    // Clear search term when selecting a category
    setSearchTerm("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>
          Add skills to showcase your expertise. These will help match you with suitable career paths.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Search and add skills */}
          <div className="space-y-4">
            <Label>Search or add skills</Label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  className="pl-9"
                  placeholder="Search for a skill or type a custom one"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setShowSuggestions(true)
                    if (e.target.value) {
                      setCustomSkill(e.target.value)
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowSuggestions(true)
                  }}
                />
              </div>

              {/* Skill suggestions */}
              {showSuggestions && (searchTerm || selectedCategory) && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg skills-suggestions">
                  {searchTerm && filteredSkills.length > 0 ? (
                    <div className="p-2">
                      <h4 className="mb-2 text-xs font-semibold text-muted-foreground">Search Results</h4>
                      <div className="space-y-1">
                        {filteredSkills.map((skill) => (
                          <div
                            key={skill.name}
                            className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 hover:bg-gray-100"
                            onClick={() => handleAddSkill(skill.name)}
                          >
                            <span>{skill.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {skill.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : searchTerm ? (
                    <div className="p-3">
                      <p className="text-sm text-muted-foreground">No matching skills found.</p>
                      <Button
                        type="button"
                        variant="ghost"
                        className="mt-2 w-full justify-start"
                        onClick={() => handleAddSkill(searchTerm)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add "{searchTerm}" as a custom skill
                      </Button>
                    </div>
                  ) : null}

                  {selectedCategory && (
                    <div className="p-2">
                      <h4 className="mb-2 text-xs font-semibold text-muted-foreground">{selectedCategory} Skills</h4>
                      <div className="space-y-1">
                        {SKILL_CATEGORIES[selectedCategory].map((skillName) => (
                          <div
                            key={skillName}
                            className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 hover:bg-gray-100"
                            onClick={() => handleAddSkill(skillName)}
                          >
                            <span>{skillName}</span>
                            {userSkills.some((s) => s.name === skillName) && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Category filters */}
            <div className="space-y-2 skills-categories">
              <Label>Browse by category</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={cn("cursor-pointer", selectedCategory === category ? "bg-primary" : "hover:bg-gray-100")}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCategorySelect(category)
                    }}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Your skills section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Your Skills ({userSkills.length})</h3>
              {userSkills.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-muted-foreground"
                  onClick={() => setUserSkills([])}
                >
                  Clear all
                </Button>
              )}
            </div>

            {userSkills.length === 0 ? (
              <div className="rounded-md border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">No skills added yet. Add skills to continue.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {userSkills.map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
                    <span>{skill.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Saved Successfully
              </>
            ) : (
              "Save & Continue"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
