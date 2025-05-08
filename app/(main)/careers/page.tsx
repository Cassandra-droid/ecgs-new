"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import CareerResults from "./career-results"
import { useToast } from "@/hooks/use-toast"

export default function CareersPage() {
  const [activeTab, setActiveTab] = useState("form")
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<{
    educationalLevel: string
    skills: string[]
    interests: string[]
  } | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoadingProfile(true)
      try {
        const response = await fetch("/api/user/profile")
        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }
        const data = await response.json()
        setUserProfile({
          educationalLevel: data.educationalLevel || "Not specified",
          skills: data.skills || [],
          interests: data.interests || [],
        })
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

    fetchUserProfile()
  }, [toast])

  const findPredictedCareers = async () => {
    if (!userProfile) {
      toast({
        title: "Error",
        description: "Profile data is not available. Please try again later.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/predict-careers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          educationalLevel: userProfile.educationalLevel,
          skills: userProfile.skills,
          interests: userProfile.interests,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to predict careers")
      }

      const data = await response.json()
      setResults(data)
      setActiveTab("results")
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
          <TabsTrigger value="results">Predicted Careers</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile Information</CardTitle>
              <CardDescription>
                The information below is from your profile. Click the button to find predicted careers based on this
                data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingProfile ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Loading your profile...</p>
                  </div>
                </div>
              ) : userProfile ? (
                <>
                  <div>
                    <h3 className="mb-2 text-lg font-medium">Educational Level</h3>
                    <p className="rounded-md bg-muted p-3">{userProfile.educationalLevel}</p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-medium">Skills</h3>
                    {userProfile.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userProfile.skills.map((skill, index) => (
                          <div key={index} className="rounded-md bg-muted px-3 py-1.5">
                            {skill}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No skills specified in your profile.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-medium">Interests</h3>
                    {userProfile.interests.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userProfile.interests.map((interest, index) => (
                          <div key={index} className="rounded-md bg-muted px-3 py-1.5">
                            {interest}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No interests specified in your profile.</p>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={findPredictedCareers}
                      className="w-full"
                      size="lg"
                      disabled={isLoading || userProfile.skills.length === 0}
                    >
                      {isLoading ? "Finding Careers..." : "Find Predicted Careers"}
                    </Button>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                      This will analyze your profile data to suggest suitable career paths.
                    </p>
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
            <CareerResults results={results} />
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="mb-4 text-muted-foreground">
                  No career predictions yet. Please use the Career Form tab to find predicted careers.
                </p>
                <Button onClick={() => setActiveTab("form")}>Go to Career Form</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
