"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, Download, Mail, Phone, Globe, MapPin, Briefcase, GraduationCap, Edit } from "lucide-react"
import { getUserProfile } from "@/lib/profile"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function ViewProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await getUserProfile()
        setProfile(data)
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

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-blue-100 text-blue-800"
      case "Intermediate":
        return "bg-green-100 text-green-800"
      case "Advanced":
        return "bg-purple-100 text-purple-800"
      case "Expert":
        return "bg-rose-100 text-rose-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Professional":
        return "bg-blue-100 text-blue-800"
      case "Technical":
        return "bg-green-100 text-green-800"
      case "Personal":
        return "bg-purple-100 text-purple-800"
      case "Academic":
        return "bg-amber-100 text-amber-800"
      case "Creative":
        return "bg-rose-100 text-rose-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleEditProfile = () => {
    router.push("/profile")
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Not Found</CardTitle>
          <CardDescription>
            Your profile information is not available. Please complete your profile first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/profile")}>Go to Profile</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button onClick={handleEditProfile} variant="outline" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt={profile.name} />
              <AvatarFallback className="text-lg">{getInitials(profile.name)}</AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-lg text-muted-foreground">{profile.title}</p>

              <div className="mt-2 flex flex-wrap justify-center gap-2 md:justify-start">
                {profile.location && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {profile.location}
                  </Badge>
                )}

                {profile.experience && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {profile.experience} experience
                  </Badge>
                )}

                {profile.education_level && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {profile.education_level}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:ml-auto">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium">About</h3>
            <p className="mt-2 text-muted-foreground">{profile.bio || "No bio provided."}</p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {profile.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
            )}

            {profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profile.phone}</span>
              </div>
            )}

            {profile.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {profile.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Your professional and technical skills</CardDescription>
            </CardHeader>
            <CardContent>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: any, index: number) => (
                    <Badge key={skill.id || index} variant="outline" className="flex items-center gap-2 px-3 py-1.5">
                      <span>{skill.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${getLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No skills added yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interests" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Interests</CardTitle>
              <CardDescription>Your professional and personal interests</CardDescription>
            </CardHeader>
            <CardContent>
              {profile.interests && profile.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest: any, index: number) => (
                    <Badge key={interest.id || index} variant="outline" className="flex items-center gap-2 px-3 py-1.5">
                      <span>{interest.name}</span>
                      {interest.category && (
                        <span className={`rounded-full px-2 py-0.5 text-xs ${getCategoryColor(interest.category)}`}>
                          {interest.category}
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No interests added yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>Your educational background</CardDescription>
            </CardHeader>
            <CardContent>
              {profile.education && profile.education.length > 0 ? (
                <div className="space-y-4">
                  {profile.education.map((edu: any, index: number) => (
                    <div key={edu.id || index} className="rounded-lg border p-4">
                      <div className="flex flex-col justify-between md:flex-row">
                        <div>
                          <h4 className="font-medium">{edu.institution}</h4>
                          <p>
                            {edu.degree}
                            {edu.field ? `, ${edu.field}` : ""}
                          </p>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground md:mt-0 md:text-right">
                          {edu.year || (edu.start_year && edu.end_year ? `${edu.start_year} - ${edu.end_year}` : "")}
                        </div>
                      </div>
                      {edu.description && <p className="mt-2 text-sm text-muted-foreground">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No education history added yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
