"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { getUserProfile } from "@/lib/profile"
import ProfileHeader from "@/components/profile/profile-header"
import PersonalInfo from "@/components/profile/personal-info"
import SkillsSection from "@/components/profile/skills-section"
import InterestsSection from "@/components/profile/interests-section"
import EducationSection from "@/components/profile/education-section"
import CompleteProfile from "@/components/profile/complete-profile"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("header")
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await getUserProfile()
        setProfile(data)
        calculateCompletion(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [toast])

  const calculateCompletion = (profileData: any) => {
    if (!profileData) return 0

    let completed = 0
    const total = 5 // 5 sections: header, personal info, skills, interests, education

    // Check header completion (less strict requirements)
    if (profileData.name && profileData.title) {
      completed++
    }

    // Check personal info completion (less strict requirements)
    if (profileData.gender && profileData.education_level && profileData.experience) {
      completed++
    }

    // Check skills completion
    if (profileData.skills && profileData.skills.length > 0) {
      completed++
    }

    // Check interests completion
    if (profileData.interests && profileData.interests.length > 0) {
      completed++
    }

    // Check education completion
    if (profileData.education && profileData.education.length > 0) {
      completed++
    }

    const percentage = Math.round((completed / total) * 100)
    setCompletionPercentage(percentage)
    return percentage
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleNextTab = () => {
    const tabs = ["header", "personal", "skills", "interests", "education", "complete"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const handleProfileUpdate = async () => {
    try {
      const data = await getUserProfile()
      setProfile(data)
      calculateCompletion(data)
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
      handleNextTab()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleViewProfile = () => {
    router.push("/profile/view")
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading profile...</span>
      </div>
    )
  }

  // Check if profile is complete - all required sections are filled
  const isProfileComplete =
    profile?.name &&
    profile?.title &&
    profile?.gender &&
    profile?.education_level &&
    profile?.experience &&
    profile?.skills?.length > 0 &&
    profile?.interests?.length > 0 &&
    profile?.education?.length > 0

  return (
    <div className="container mx-auto py-6">
      {/* Only show progress card if not on complete tab or if profile is not complete */}
      {(activeTab !== "complete" || !isProfileComplete) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>Complete your profile to get personalized career recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">{completionPercentage}% Complete</span>
              <span className="text-sm text-muted-foreground">
                {completionPercentage === 100 ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    All sections completed!
                  </span>
                ) : (
                  "Complete all sections"
                )}
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="header">Profile</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="complete">Complete</TabsTrigger>
        </TabsList>

        <TabsContent value="header">
          <ProfileHeader profile={profile} onUpdate={handleProfileUpdate} />
        </TabsContent>

        <TabsContent value="personal">
          <PersonalInfo profile={profile} onUpdate={handleProfileUpdate} />
        </TabsContent>

        <TabsContent value="skills">
          <SkillsSection skills={profile?.skills || []} onUpdate={handleProfileUpdate} />
        </TabsContent>

        <TabsContent value="interests">
          <InterestsSection interests={profile?.interests || []} onUpdate={handleProfileUpdate} />
        </TabsContent>

        <TabsContent value="education">
          <EducationSection education={profile?.education || []} onUpdate={handleProfileUpdate} />
        </TabsContent>

        <TabsContent value="complete">
          {isProfileComplete ? (
            <div className="space-y-6">
              <CompleteProfile profile={profile} />
              <div className="flex justify-center">
                <Button onClick={handleViewProfile} size="lg" className="px-8">
                  View Full Profile
                </Button>
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Profile</CardTitle>
                <CardDescription>
                  Please complete all previous sections before viewing your complete profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={completionPercentage} className="h-2 mb-4" />
                <p className="text-muted-foreground">
                  You have completed {completionPercentage}% of your profile. Continue filling out the remaining
                  sections to unlock your complete profile view.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Only show navigation buttons if not on complete tab with complete profile */}
      {!(activeTab === "complete" && isProfileComplete) && (
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              const tabs = ["header", "personal", "skills", "interests", "education", "complete"]
              const currentIndex = tabs.indexOf(activeTab)
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1])
              }
            }}
            disabled={activeTab === "header"}
          >
            Previous
          </Button>
          <Button onClick={handleNextTab} disabled={activeTab === "complete"}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
