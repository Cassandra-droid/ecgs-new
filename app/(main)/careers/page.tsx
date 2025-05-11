"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, ExternalLink } from "lucide-react"
import CareerResults from "./career-results"
import { useToast } from "@/hooks/use-toast"
import { getUserProfile } from "@/lib/profile"

export default function CareersPage() {
  const [activeTab, setActiveTab] = useState("form")
  const [results, setResults] = useState<any[]>([])
  const [explanation, setExplanation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoadingProfile(true)
      try {
        const profileData = await getUserProfile()
        setProfile(profileData)
      } catch (error) {
        console.error("Error fetching user profile:", error)
        toast({
          title: "Error",
          description: "Failed to load your profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingProfile(false)
      }
    }

    const fetchLatestPrediction = async () => {
      setIsLoadingPrediction(true)
      try {
        const response = await fetch("/api/career/predictions/latest")

        if (response.ok) {
          const data = await response.json()
          setResults(data.results || [])
          setExplanation(data.explanation || null)

          // If we have results, switch to results tab
          if (data.results && data.results.length > 0) {
            setActiveTab("results")
          }
        }
      } catch (error) {
        console.error("Error fetching latest prediction:", error)
        // Don't show error toast here as it's normal for new users to not have predictions
      } finally {
        setIsLoadingPrediction(false)
      }
    }

    fetchUserProfile()
    fetchLatestPrediction()
  }, [toast])

  const findPredictedCareers = async () => {
    if (!profile) {
      toast({
        title: "Error",
        description: "Profile data is not available. Please try again later.",
        variant: "destructive",
      })
      return
    }

    // Check if required profile data exists
    if (
      !profile.education_level ||
      !profile.skills ||
      profile.skills.length === 0 ||
      !profile.interests ||
      profile.interests.length === 0
    ) {
      toast({
        title: "Incomplete Profile",
        description: "Please complete your education level, skills, and interests in your profile.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Extract education level name if it's an object
      const educationLevel =
        typeof profile.education_level === "object" && profile.education_level !== null
          ? profile.education_level.name
          : profile.education_level

      // Extract skill names if they're objects
      const skills = profile.skills.map((skill: any) =>
        typeof skill === "object" && skill !== null ? skill.name : skill,
      )

      // Extract interest names if they're objects
      const interests = profile.interests.map((interest: any) =>
        typeof interest === "object" && interest !== null ? interest.name : interest,
      )

      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          educationLevel,
          skills,
          interests,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to predict careers")
      }

      const data = await response.json()

      // Save the explanation separately
      const explanationData = data.recommendations[0]?.explanation || {
        skills: skills,
        interests: interests,
        education_match: true,
      }

      setResults(data.recommendations || [])
      setExplanation(explanationData)
      setActiveTab("results")

      // Save the prediction to the database
      await saveCareerPrediction(educationLevel, explanationData, data.recommendations)
    } catch (error) {
      console.error("Error predicting careers:", error)
      toast({
        title: "Error",
        description: "Failed to predict careers. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveCareerPrediction = async (educationLevel: string, explanation: any, results: any[]) => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/career/predictions/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          educationLevel,
          explanation,
          results,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save career prediction")
      }

      toast({
        title: "Success",
        description: "Your career prediction has been saved.",
      })
    } catch (error) {
      console.error("Error saving career prediction:", error)
      toast({
        title: "Warning",
        description: "Your prediction was generated but couldn't be saved for future sessions.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Check if profile is complete enough for career prediction
  const isProfileSufficientForPrediction =
    profile &&
    profile.education_level &&
    profile.skills &&
    profile.skills.length > 0 &&
    profile.interests &&
    profile.interests.length > 0

  // Helper function to safely display profile data that might be objects
  const displayProfileItem = (item: any) => {
    if (typeof item === "object" && item !== null) {
      return item.name || JSON.stringify(item)
    }
    return item
  }

  // Show loading state while fetching initial data
  if (isLoadingProfile || isLoadingPrediction) {
    return (
      <div className="container mx-auto flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading your career information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Career Exploration</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Career Form</TabsTrigger>
          <TabsTrigger value="results">Recommended Careers</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                The information below is from your profile. Click the button to find careers recommended based on this
                data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile ? (
                <>
                  <div>
                    <h3 className="mb-2 text-lg font-medium">Educational Level</h3>
                    {profile.education_level ? (
                      <p className="rounded-md bg-muted p-3">{displayProfileItem(profile.education_level)}</p>
                    ) : (
                      <div className="rounded-md border border-dashed p-3 text-center">
                        <p className="text-muted-foreground">Educational level not specified</p>
                        <Link href="/profile" className="mt-2 inline-flex items-center text-sm text-primary">
                          Update in profile <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-medium">Skills</h3>
                    {profile.skills && profile.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill: any, index: number) => (
                          <div key={index} className="rounded-md bg-muted px-3 py-1.5">
                            {displayProfileItem(skill)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-md border border-dashed p-3 text-center">
                        <p className="text-muted-foreground">No skills specified in your profile</p>
                        <Link href="/profile" className="mt-2 inline-flex items-center text-sm text-primary">
                          Add skills <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-medium">Interests</h3>
                    {profile.interests && profile.interests.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest: any, index: number) => (
                          <div key={index} className="rounded-md bg-muted px-3 py-1.5">
                            {displayProfileItem(interest)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-md border border-dashed p-3 text-center">
                        <p className="text-muted-foreground">No interests specified in your profile</p>
                        <Link href="/profile" className="mt-2 inline-flex items-center text-sm text-primary">
                          Add interests <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={findPredictedCareers}
                      className="w-full"
                      size="lg"
                      disabled={isLoading || !isProfileSufficientForPrediction}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finding Careers...
                        </>
                      ) : (
                        "Find Predicted Careers"
                      )}
                    </Button>

                    {!isProfileSufficientForPrediction && (
                      <p className="mt-2 text-center text-sm text-amber-600">
                        Please complete your education level, skills, and interests in your profile before predicting
                        careers.
                      </p>
                    )}

                    {isProfileSufficientForPrediction && (
                      <p className="mt-2 text-center text-sm text-muted-foreground">
                        This will analyze your profile data to suggest suitable career paths.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-6 text-center">
                  <p className="mb-4 text-muted-foreground">
                    Unable to load your profile data. Please try refreshing the page.
                  </p>
                  <Button onClick={() => window.location.reload()}>Refresh Page</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          {results.length > 0 ? (
            <CareerResults results={results} explanation={explanation} />
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="mb-4 text-muted-foreground">
                  No career predictions yet. Please use the Career Form tab to find recommended careers.
                </p>
                <Button onClick={() => setActiveTab("form")}>Go to Career Form</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {isSaving && (
        <div className="fixed bottom-4 right-4 rounded-md bg-primary/10 p-3 text-sm text-primary">
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving your career recommendations...
          </div>
        </div>
      )}
    </div>
  )
}
