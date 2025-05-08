/* eslint-disable react/no-unescaped-entities */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface CareerResult {
  title: string
  matchScore: number
  description: string
  requiredSkills: string[]
  industryType: string
}

interface CareerResultsProps {
  results: CareerResult[]
}

export default function CareerResults({ results }: CareerResultsProps) {
  // Add console log to debug the results
  console.log("Career results received:", results)

  const careerResults = Array.isArray(results) ? results : []

  // Check if we have any results to display
  const initialExpandedJobs: { [key: string]: boolean } = {}
  if (Array.isArray(results)) {
    results.forEach((career) => {
      initialExpandedJobs[career.title] = false
    })
  }

  const [expandedJobs, setExpandedJobs] = useState(initialExpandedJobs)

  if (careerResults.length === 0) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">No Career Matches Found</h2>
        <p className="mb-6 text-muted-foreground">
          We couldn't find any career matches based on your criteria. Try adjusting your skills or interests.
        </p>
      </div>
    )
  }

  const toggleJobDetails = (title: string) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Career Matches</h2>

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
                <CardDescription className="mb-4 text-sm">{career.description}</CardDescription>
                <div>
                  <h4 className="mb-2 text-sm font-semibold">Required Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {career.requiredSkills?.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Button variant="outline" onClick={() => toggleJobDetails(career.title)} className="w-full">
                  {expandedJobs[career.title] ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Hide Job Listings
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      View Job Listings
                    </>
                  )}
                </Button>
              </CardFooter>

              {expandedJobs[career.title] && (
                <div className="border-t px-6 pb-6 pt-4">
                  <h4 className="mb-3 font-medium">Sample Job Listings</h4>
                  <div className="space-y-3">
                    <div className="rounded-md bg-muted p-3">
                      <div className="mb-1 flex justify-between">
                        <span className="font-medium">{career.title} at TechCorp</span>
                        <Badge variant="outline">Remote</Badge>
                      </div>
                      <p className="mb-2 text-sm text-muted-foreground">
                        Join our team as a {career.title} and work on cutting-edge projects.
                      </p>
                      <div className="text-sm">$80K - $120K • Full-time</div>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <div className="mb-1 flex justify-between">
                        <span className="font-medium">Senior {career.title} at InnovateCo</span>
                        <Badge variant="outline">Hybrid</Badge>
                      </div>
                      <p className="mb-2 text-sm text-muted-foreground">
                        Looking for an experienced {career.title} to lead our growing team.
                      </p>
                      <div className="text-sm">$100K - $150K • Full-time</div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No career matches found. Try adjusting your criteria.</p>
        </div>
      )}
    </div>
  )
}
