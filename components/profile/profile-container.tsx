"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ProfileHeader from "./profile-header"
import PersonalInfo from "./personal-info"
import SkillsSection from "./skills-section"
import InterestsSection from "./interests-section"
import EducationSection from "./education-section"
import CompleteProfile from "./complete-profile"
import ProfileProgress from "./profile-progress"
import { getUserProfile } from "@/lib/profile"
import { useToast } from "@/components/ui/use-toast"

export default function ProfileContainer() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const { toast } = useToast()

  const steps = [
    { id: "header", label: "Profile Header" },
    { id: "personal", label: "Personal Info" },
    { id: "skills", label: "Skills" },
    { id: "interests", label: "Interests" },
    { id: "education", label: "Education" },
  ]

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const profileData = await getUserProfile()
      setProfile(profileData)

      // Check if profile is complete
      checkProfileCompletion(profileData)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to load your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkProfileCompletion = (profileData: any) => {
    // Check if all required sections are complete
    const hasHeader = profileData?.name && profileData?.title
    const hasPersonalInfo = profileData?.gender && profileData?.education_level && profileData?.experience
    const hasSkills = profileData?.skills && profileData?.skills.length > 0
    const hasInterests = profileData?.interests && profileData?.interests.length > 0
    const hasEducation = profileData?.education && profileData?.education.length > 0

    const complete = hasHeader && hasPersonalInfo && hasSkills && hasInterests && hasEducation
    setIsComplete(complete)
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleUpdate = async () => {
    await fetchProfile()
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // If profile is complete and user has viewed all steps, show the complete profile
  if (isComplete && currentStep >= steps.length - 1) {
    return <CompleteProfile profile={profile} />
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <ProfileProgress profile={profile} currentStep={currentStep} totalSteps={steps.length} />

      <Tabs
        value={steps[currentStep].id}
        className="w-full"
        onValueChange={(value) => {
          const index = steps.findIndex((step) => step.id === value)
          if (index !== -1) {
            setCurrentStep(index)
          }
        }}
      >
        <TabsList className="grid w-full grid-cols-5">
          {steps.map((step) => (
            <TabsTrigger key={step.id} value={step.id}>
              {step.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="header" className="mt-6">
          <ProfileHeader profile={profile} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="personal" className="mt-6">
          <PersonalInfo profile={profile} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <SkillsSection skills={profile?.skills || []} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="interests" className="mt-6">
          <InterestsSection interests={profile?.interests || []} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          <EducationSection education={profile?.education || []} onUpdate={handleUpdate} />
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <Button onClick={handleNext} disabled={currentStep === steps.length - 1}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
