"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession, getCurrentUser } from "@/lib/auth"

// Get user profile data with related information
export async function getUserProfile(userId: string | undefined) {
  if (!userId) return null

  try {
    // First check if the user has a profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            skills: true,
            interests: true,
            education: true,
          },
        },
      },
    })

    if (!user || !user.profile) {
      // Return default empty profile if not found
      return {
        title: "",
        bio: "",
        gender: "",
        age: null,
        educationLevel: "",
        experience: "",
        careerPreferences: "",
        location: "",
        phone: "",
        website: "",
        skills: [],
        education: [],
        interests: [],
      }
    }

    return {
      title: user.profile.title || "",
      bio: user.profile.bio || "",
      gender: user.profile.gender || "",
      age: user.profile.age || null,
      educationLevel: user.profile.educationLevel || "",
      experience: user.profile.experience || "",
      careerPreferences: user.profile.careerPreferences || "",
      location: user.profile.location || "",
      phone: user.profile.phone || "",
      website: user.profile.website || "",
      skills: user.profile.skills || [],
      education: user.profile.education || [],
      interests: user.profile.interests || [],
    }
  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    throw new Error("Failed to fetch user profile")
  }
}

// Get the current user's session
async function getSession() {
  const session = await getServerSession()
  if (!session || !session.user) {
    throw new Error("Unauthorized")
  }
  return session
}

// Ensure user has a profile
async function ensureUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  })

  if (!user) throw new Error("User not found")

  if (!user.profile) {
    // Create a profile if it doesn't exist
    return await prisma.userProfile.create({
      data: {
        userId: user.id,
      },
    })
  }

  return user.profile
}

// Update profile header (name, title, bio)
export async function updateProfileHeader(data: {
  name: string
  title: string
  bio: string
}) {
  try {
    const session = await getSession()
    const user = session.user as { id: string }
    const userId = user.id

    // Update user name
    await prisma.user.update({
      where: { id: userId },
      data: { name: data.name },
    })

    // Ensure profile exists and update it
    const profile = await ensureUserProfile(userId)

    await prisma.userProfile.update({
      where: { id: profile.id },
      data: {
        title: data.title,
        bio: data.bio,
      },
    })

    // Revalidate the profile page to show updated data
    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Failed to update profile header:", error)
    throw new Error("Failed to update profile header")
  }
}

// Update personal information
export async function updatePersonalInfo(data: {
  name: string
  email: string
  title: string
  bio: string
  gender: string
  age?: number | string
  educationLevel: string
  experience: string
  careerPreferences: string
  location: string
  phone: string
  website: string
}) {
  try {
    const session = await getSession()
    const user = session.user as { id: string }
    const userId = user.id

    // Update user name
    await prisma.user.update({
      where: { id: userId },
      data: { name: data.name },
    })

    // Ensure profile exists and update it
    const profile = await ensureUserProfile(userId)

    await prisma.userProfile.update({
      where: { id: profile.id },
      data: {
        title: data.title,
        bio: data.bio,
        gender: data.gender,
        age: data.age ? Number(data.age) : null,
        educationLevel: data.educationLevel,
        experience: data.experience,
        careerPreferences: data.careerPreferences,
        location: data.location,
        phone: data.phone,
        website: data.website,
      },
    })

    // Revalidate the profile page to show updated data
    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Failed to update personal info:", error)
    throw new Error("Failed to update personal info")
  }
}

// Update user skills - adapted for many-to-many relationship
export async function updateUserSkills(userId: string, skills: Array<{ name: string; level?: string }>) {
  try {
    // Ensure profile exists
    const profile = await ensureUserProfile(userId)

    // First disconnect all existing skill connections
    await prisma.userProfile.update({
      where: { id: profile.id },
      data: {
        skills: {
          set: [], // Remove all current connections
        },
      },
    })

    // Connect or create skills
    for (const skill of skills) {
      // Find the skill or create if it doesn't exist
      let existingSkill = null;
      
      if (skill.level) {
        existingSkill = await prisma.skill.findFirst({
          where: {
            name: skill.name,
            level: skill.level,
          },
        });
      } else {
        existingSkill = await prisma.skill.findFirst({
          where: {
            name: skill.name,
          },
        });
      }

      if (existingSkill) {
        // Connect existing skill to profile
        await prisma.userProfile.update({
          where: { id: profile.id },
          data: {
            skills: {
              connect: { id: existingSkill.id },
            },
          },
        })
      } else {
        // Create new skill and connect to profile
        await prisma.userProfile.update({
          where: { id: profile.id },
          data: {
            skills: {
              create: {
                name: skill.name,
                level: skill.level,
              },
            },
          },
        })
      }
    }

    // Revalidate the profile page to show updated data
    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Failed to update skills:", error)
    throw new Error("Failed to update skills")
  }
}

// Update user education
export async function updateUserEducation(userId: string, education: any[]) {
  try {
    // Ensure profile exists
    const profile = await ensureUserProfile(userId)

    // Delete existing education entries
    await prisma.education.deleteMany({
      where: { profileId: profile.id },
    })

    // Create new education entries
    if (education.length > 0) {
      await prisma.education.createMany({
        data: education.map((edu) => ({
          institution: edu.institution,
          degree: edu.degree,
          field: edu.field || null,
          startYear: edu.startYear || null,
          endYear: edu.endYear || null,
          description: edu.description || null,
          profileId: profile.id,
        })),
      })
    }

    // Revalidate the profile page to show updated data
    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Failed to update education:", error)
    throw new Error("Failed to update education")
  }
}

// Update user interests - adapted for many-to-many relationship
export async function updateUserInterests(userId: string, interests: Array<{ name: string; category?: string }>) {
  try {
    // Ensure profile exists
    const profile = await ensureUserProfile(userId)

    // First disconnect all existing interest connections
    await prisma.userProfile.update({
      where: { id: profile.id },
      data: {
        interests: {
          set: [], // Remove all current connections
        },
      },
    })

    // Connect or create interests
    for (const interest of interests) {
      // Find the interest or create if it doesn't exist
      let existingInterest = null;
      
      if (interest.category) {
        existingInterest = await prisma.interest.findFirst({
          where: {
            name: interest.name,
            category: interest.category,
          },
        });
      } else {
        existingInterest = await prisma.interest.findFirst({
          where: {
            name: interest.name,
          },
        });
      }

      if (existingInterest) {
        // Connect existing interest to profile
        await prisma.userProfile.update({
          where: { id: profile.id },
          data: {
            interests: {
              connect: { id: existingInterest.id },
            },
          },
        })
      } else {
        // Create new interest and connect to profile
        await prisma.userProfile.update({
          where: { id: profile.id },
          data: {
            interests: {
              create: {
                name: interest.name,
                category: interest.category,
              },
            },
          },
        })
      }
    }

    // Revalidate the profile page to show updated data
    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Failed to update interests:", error)
    throw new Error("Failed to update interests")
  }
}