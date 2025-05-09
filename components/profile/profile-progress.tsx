"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2 } from "lucide-react"

interface ProfileProgressProps {
  profile: any
  currentStep: number
  totalSteps: number
}

export default function ProfileProgress({ profile, currentStep, totalSteps }: ProfileProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Calculate progress based on profile completeness
    let completedSections = 0

    // Check if profile header is complete
    if (profile?.name && profile?.title) {
      completedSections++
    }

    // Check if personal info is complete
    if (profile?.gender && profile?.education_level && profile?.experience) {
      completedSections++
    }

    // Check if skills are added
    if (profile?.skills && profile?.skills.length > 0) {
      completedSections++
    }

    // Check if interests are added
    if (profile?.interests && profile?.interests.length > 0) {
      completedSections++
    }

    // Check if education is added
    if (profile?.education && profile?.education.length > 0) {
      completedSections++
    }

    // Calculate percentage (add current step to give a sense of progress)
    const percentage = Math.min(Math.round((completedSections / 5) * 100), 100)

    setProgress(percentage)
  }, [profile, currentStep])

  return (
    <div className="mb-6 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Profile Completion</h3>
        <div className="flex items-center">
          <span className="text-sm font-medium">{progress}%</span>
          {progress === 100 && <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />}
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
