"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProfileHeader from "@/components/profile/profile-header"
import PersonalInfoTab from "@/components/profile/personal-info-tab"
import SkillsTab from "@/components/profile/skills-tab"
import EducationTab from "@/components/profile/education-tab"
import InterestsTab from "@/components/profile/interests-tab"
import SecurityTab from "@/components/profile/security-tab"
import { useAuth } from "@/hooks/use-auth"
import { getUserProfile } from "@/lib/profile"

interface Skill {
  id: string
  name: string
  level: string
}

interface Interest {
  id: string
  name: string
  category: string
}

const Profile = () => {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
   // if (!loading && !isAuthenticated) {
    //  router.push("/sign-in")
  //  }
  },
   [loading, isAuthenticated, router])

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        const profileData = await getUserProfile(user.id)
        setProfile(profileData)
      }
    }
    fetchProfile()
  }, [user])

  if (loading || !user) {
    return <div className="text-center py-10">Loading profile...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-4 flex items-center">
        <Link href="/dashboard" className="text-sm font-medium text-primary hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Manage your personal information and resume details</CardDescription>
        </CardHeader>

        <CardContent>
          <ProfileHeader
            user={{
              username: user.username,
              email: user.email,
              image: user.image || "",
              title: profile?.title || "",
              bio: profile?.bio || "",
            }}
          />

          <Tabs defaultValue="personal" className="mt-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="interests">Interests</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <PersonalInfoTab
                user={{
                  username: user.username,
                  email: user.email,
                  title: profile?.title || "",
                  bio: profile?.bio || "",
                  gender: profile?.gender || "",
                  location: profile?.location || "",
                  phone: profile?.phone || "",
                  website: profile?.website || "",
                }}
              />
            </TabsContent>

            <TabsContent value="skills">
              <SkillsTab
                skills={(profile?.skills || []).map((skill: Skill) => ({
                  ...skill,
                  level: skill.level || "Unknown",
                }))}
                userId={user.id || ""}
              />
            </TabsContent>

            <TabsContent value="education">
              <EducationTab education={profile?.education || []} userId={user.id || ""} />
            </TabsContent>

            <TabsContent value="interests">
              <InterestsTab
                interests={(profile?.interests || []).map((interest: Interest) => ({
                  ...interest,
                  category: interest.category || "",
                }))}
                userId={user.id || ""}
              />
            </TabsContent>

            <TabsContent value="security">
              <SecurityTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile
