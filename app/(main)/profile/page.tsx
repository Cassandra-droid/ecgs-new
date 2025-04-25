import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import ProfileHeader from "@/components/profile/profile-header"
import PersonalInfoTab from "@/components/profile/personal-info-tab"
import SkillsTab from "@/components/profile/skills-tab"
import EducationTab from "@/components/profile/education-tab"
import InterestsTab from "@/components/profile/interests-tab"
import SecurityTab from "@/components/profile/security-tab"
import { getUserProfile } from "@/lib/profile"

const Profile = async () => {
  const user = await getCurrentUser()
  const profile = await getUserProfile(user?.id)

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
              name: user?.name || "",
              email: user?.email || "",
              image: user?.image || "",
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
                  name: user?.name || "",
                  email: user?.email || "",
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
                skills={(profile?.skills || []).map(skill => ({
                  ...skill,
                  level: skill.level || "Unknown",
                }))}
                userId={user?.id || ""}
              />
            </TabsContent>

            <TabsContent value="education">
              <EducationTab education={profile?.education || []} userId={user?.id || ""} />
            </TabsContent>

            <TabsContent value="interests">
              <InterestsTab
                interests={(profile?.interests || []).map(interest => ({
                  ...interest,
                  category: interest.category || "",
                }))}
                userId={user?.id || ""}
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
