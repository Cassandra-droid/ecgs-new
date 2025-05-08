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
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("header")
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const { toast } = useToast()

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

    // Check header completion
    if (profileData.title && profileData.bio) {
      completed++
    }

    // Check personal info completion
    if (
      profileData.gender &&
      profileData.age &&
      profileData.education_level &&
      profileData.experience &&
      profileData.location
    ) {
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

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading profile...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile Completion</CardTitle>
          <CardDescription>Complete your profile to get personalized career recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">{completionPercentage}% Complete</span>
            <span className="text-sm text-muted-foreground">
              {completionPercentage === 100 ? "All sections completed!" : "Complete all sections"}
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </CardContent>
      </Card>

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
          <CompleteProfile profile={profile} />
        </TabsContent>
      </Tabs>

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
    </div>
  )
}

