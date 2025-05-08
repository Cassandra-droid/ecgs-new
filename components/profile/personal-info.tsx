"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updatePersonalInfo } from "@/lib/profile"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface PersonalInfoProps {
  profile: any
  onUpdate: () => void
}

export default function PersonalInfo({ profile, onUpdate }: PersonalInfoProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    title: profile?.title || "",
    bio: profile?.bio || "",
    gender: profile?.gender || "",
    age: profile?.age || "",
    educationLevel: profile?.education_level || "",
    experience: profile?.experience || "",
    careerPreferences: profile?.career_preferences || "",
    location: profile?.location || "",
    phone: profile?.phone || "",
    website: profile?.website || "",
  })
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.gender || !formData.educationLevel || !formData.experience) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await updatePersonalInfo(formData)
      toast({
        title: "Personal info updated",
        description: "Your personal information has been updated successfully.",
      })
      onUpdate()
    } catch (error) {
      console.error("Error updating personal info:", error)
      toast({
        title: "Update failed",
        description: "There was a problem updating your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Tell us more about yourself to help us personalize your experience</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" placeholder="25" value={formData.age} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="educationLevel">Education Level</Label>
              <Select
                value={formData.educationLevel}
                onValueChange={(value) => handleSelectChange("educationLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="associate">Associate Degree</SelectItem>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                  <SelectItem value="doctorate">Doctorate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Select value={formData.experience} onValueChange={(value) => handleSelectChange("experience", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="1-3">1-3 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="careerPreferences">Career Preferences</Label>
            <Input
              id="careerPreferences"
              name="careerPreferences"
              placeholder="E.g., Remote work, Tech industry, etc."
              value={formData.careerPreferences}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website/Portfolio</Label>
            <Input
              id="website"
              name="website"
              placeholder="https://yourportfolio.com"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
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
