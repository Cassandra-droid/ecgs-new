"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { updateProfileHeader } from "@/lib/profile"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface ProfileHeaderProps {
  profile: any
  onUpdate: () => void
}

export default function ProfileHeader({ profile, onUpdate }: ProfileHeaderProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    title: profile?.title || "",
    bio: profile?.bio || "",
  })
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.title) {
      toast({
        title: "Missing information",
        description: "Please provide your name and professional title.",
        variant: "destructive",
      })
      return
    }

    try {
      await updateProfileHeader({ name: formData.name, email: formData.email })
      await updateProfileHeader(formData)
      toast({
        title: "Profile updated",
        description: "Your profile header has been updated successfully.",
      })
      onUpdate()
    } catch (error) {
      console.error("Error updating profile header:", error)
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Header</CardTitle>
        <CardDescription>This information will be displayed at the top of your profile</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Software Engineer"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={handleChange}
              rows={4}
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
