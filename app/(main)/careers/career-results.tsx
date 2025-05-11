/* eslint-disable react/no-unescaped-entities */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building,
  MapPin,
  Calendar,
  ExternalLink,
  Clock,
} from "lucide-react"
import { useState } from "react"

interface Explanation {
  skills: string[]
  interests: string[]
  education_match: boolean
}

interface CareerResult {
  title: string
  matchScore: number
  description: string
  requiredSkills: string[]
  industryType: string
}

interface JobListing {
  id: number
  title: string
  company: string | null
  location: string | null
  posted_date: string | null
  job_url: string | null
  deadline: string | null
  job_type: string | null
  created_at: string
  updated_at: string
}

interface CareerResultsProps {
  results: CareerResult[]
  explanation?: Explanation | null
}

export default function CareerResults({ results, explanation }: CareerResultsProps) {
  // Add console log to debug the results
  console.log("Career results received:", results)
  console.log("Explanation received:", explanation)

  const careerResults = Array.isArray(results) ? results : []

  // Check if we have any results to display
  const initialExpandedJobs: { [key: string]: boolean } = {}
  if (Array.isArray(results)) {
    results.forEach((career) => {
      initialExpandedJobs[career.title] = false
    })
  }

  const [expandedJobs, setExpandedJobs] = useState(initialExpandedJobs)
  const [showAllSkills, setShowAllSkills] = useState(false)
  const [showAllInterests, setShowAllInterests] = useState(false)
  const [jobListings, setJobListings] = useState<{ [key: string]: JobListing[] }>({})
  const [loadingJobs, setLoadingJobs] = useState<{ [key: string]: boolean }>({})
  const [jobErrors, setJobErrors] = useState<{ [key: string]: string }>({})

  if (careerResults.length === 0) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">No Career Recommendations</h2>
        <p className="mb-6 text-muted-foreground">
          We couldn't find any career recommendations based on your criteria. Try adjusting your skills or interests.
        </p>
      </div>
    )
  }

  const toggleJobDetails = async (title: string) => {
    // Toggle the expanded state
    setExpandedJobs((prev) => {
      const newState = { ...prev, [title]: !prev[title] }

      // If we're expanding and don't have job listings yet, fetch them
      if (newState[title] && (!jobListings[title] || jobListings[title].length === 0)) {
        fetchJobListings(title)
      }

      return newState
    })
  }

  const fetchJobListings = async (careerTitle: string) => {
    // Set loading state for this career
    setLoadingJobs((prev) => ({ ...prev, [careerTitle]: true }))
    // Clear any previous errors
    setJobErrors((prev) => ({ ...prev, [careerTitle]: "" }))

    try {
      const encodedTitle = encodeURIComponent(careerTitle)
      const response = await fetch(`/api/jobs/${encodedTitle}`)

      if (!response.ok) {
        throw new Error("Failed to fetch job listings")
      }

      const data = await response.json()
      setJobListings((prev) => ({ ...prev, [careerTitle]: data }))
    } catch (error) {
      console.error(`Error fetching job listings for ${careerTitle}:`, error)
      setJobErrors((prev) => ({
        ...prev,
        [careerTitle]: "Unable to load job listings. Please try again later.",
      }))
    } finally {
      setLoadingJobs((prev) => ({ ...prev, [careerTitle]: false }))
    }
  }

  // Format date to a more readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified"

    try {
      const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
      return new Date(dateString).toLocaleDateString(undefined, options)
    } catch (e) {
      return dateString // If parsing fails, return the original string
    }
  }

  // Determine if we need to show "Show More" buttons
  const skillsToShow =
    showAllSkills || !explanation?.skills || explanation.skills.length <= 5
      ? explanation?.skills || []
      : explanation.skills.slice(0, 5)

  const interestsToShow =
    showAllInterests || !explanation?.interests || explanation.interests.length <= 5
      ? explanation?.interests || []
      : explanation.interests.slice(0, 5)

  const hasMoreSkills = explanation?.skills && explanation.skills.length > 5 && !showAllSkills
  const hasMoreInterests = explanation?.interests && explanation.interests.length > 5 && !showAllInterests

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Career Recommendations</h2>

      {/* Single explanation card at the top */}
      {explanation && (
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-xl">Why These Careers Were Recommended</CardTitle>
            <CardDescription>Based on your profile information, we've identified the following recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="rounded-lg border p-4">
              <h3 className="mb-3 text-lg font-medium">Based on your skills:</h3>
              {explanation.skills && explanation.skills.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-2">
                    {skillsToShow.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {hasMoreSkills && (
                    <Button variant="link" onClick={() => setShowAllSkills(true)} className="mt-2 h-auto p-0 text-sm">
                      Show {explanation.skills.length - 5} more skills
                    </Button>
                  )}
                </>
              ) : (
                <div className="flex items-center text-muted-foreground">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  No specific skills were matched
                </div>
              )}
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-3 text-lg font-medium">Based on your interests:</h3>
              {explanation.interests && explanation.interests.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-2">
                    {interestsToShow.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="bg-primary/10 px-3 py-1 text-sm text-primary">
                        {interest}
                      </Badge>
                    ))}
                  </div>

                  {hasMoreInterests && (
                    <Button
                      variant="link"
                      onClick={() => setShowAllInterests(true)}
                      className="mt-2 h-auto p-0 text-sm"
                    >
                      Show {explanation.interests.length - 5} more interests
                    </Button>
                  )}
                </>
              ) : (
                <div className="flex items-center text-muted-foreground">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  No specific interests were matched
                </div>
              )}
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-medium">Education qualification:</h3>
              <div className="flex items-center">
                {explanation.education_match ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Your education level meets the requirements for these career paths
                  </span>
                ) : (
                  <span className="flex items-center text-amber-600">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    You may need additional education for some of these career paths
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-muted/30 p-4 text-sm text-muted-foreground">
              <p>
                These career recommendations are based on how your profile matches with the career
                trends. The match score indicates the strength of alignment between your profile and each career path.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {results && results.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((career, index) => (
            <Card key={index} className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{career.title}</CardTitle>
                  <Badge variant="outline" className="ml-2">
                    {career.industryType}
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm font-medium">Match Score</span>
                    <span className="text-sm font-medium">{career.matchScore}%</span>
                  </div>
                  <Progress value={career.matchScore} className="h-2" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-sm">
                  {career.description || "No description available"}
                </CardDescription>
                {career.requiredSkills && career.requiredSkills.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Required Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {career.requiredSkills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Button variant="outline" onClick={() => toggleJobDetails(career.title)} className="w-full">
                  {expandedJobs[career.title] ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Hide Available Jobs
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      View Available Jobs
                    </>
                  )}
                </Button>
              </CardFooter>

              {expandedJobs[career.title] && (
                <div className="border-t px-6 pb-6 pt-4">
                  <h4 className="mb-3 font-medium">Available Jobs for {career.title}</h4>

                  {/* Loading state */}
                  {loadingJobs[career.title] && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Loading available jobs...</p>
                    </div>
                  )}

                  {/* Error state */}
                  {jobErrors[career.title] && (
                    <div className="rounded-md bg-destructive/10 p-4 text-center text-sm text-destructive">
                      <p>{jobErrors[career.title]}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchJobListings(career.title)}
                        className="mt-2"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}

                  {/* No jobs found state */}
                  {!loadingJobs[career.title] &&
                    !jobErrors[career.title] &&
                    (!jobListings[career.title] || jobListings[career.title].length === 0) && (
                      <div className="py-4 text-center text-sm text-muted-foreground">
                        <p>No current running jobs found for {career.title}.</p>
                        <p className="mt-1">Try checking back later for new opportunities.</p>
                      </div>
                    )}

                  {/* Job listings */}
                  {!loadingJobs[career.title] &&
                    !jobErrors[career.title] &&
                    jobListings[career.title] &&
                    jobListings[career.title].length > 0 && (
                      <div className="space-y-4">
                        {jobListings[career.title].map((job) => (
                          <div key={job.id} className="rounded-md border p-4">
                            <div className="mb-2 flex items-start justify-between">
                              <h5 className="font-medium">{job.title}</h5>
                              {job.job_type && <Badge variant="outline">{job.job_type}</Badge>}
                            </div>

                            <div className="mb-3 space-y-1 text-sm">
                              {job.company && (
                                <div className="flex items-center text-muted-foreground">
                                  <Building className="mr-1.5 h-3.5 w-3.5" />
                                  {job.company}
                                </div>
                              )}

                              {job.location && (
                                <div className="flex items-center text-muted-foreground">
                                  <MapPin className="mr-1.5 h-3.5 w-3.5" />
                                  {job.location}
                                </div>
                              )}

                              {job.posted_date && (
                                <div className="flex items-center text-muted-foreground">
                                  <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                  Posted: {job.posted_date}
                                </div>
                              )}

                              {job.deadline && (
                                <div className="flex items-center text-muted-foreground">
                                  <Clock className="mr-1.5 h-3.5 w-3.5" />
                                  Deadline: {formatDate(job.deadline)}
                                </div>
                              )}
                            </div>

                            {job.job_url && (
                              <a href={job.job_url} target="_blank" rel="noopener noreferrer" className="w-full">
                                <Button size="sm" className="w-full">
                                  View Job Details <ExternalLink className="ml-2 h-3.5 w-3.5" />
                                </Button>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No career recommendations found. Try adjusting your criteria.</p>
        </div>
      )}
    </div>
  )
}
