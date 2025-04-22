import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession, signJwtToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, age, gender, educationLevel, experience, careerPreferences, skills, interests } = await request.json()

    console.log("Creating/updating profile for user:", session.id)
    console.log("Received data:", { name, age, gender, educationLevel, skills, interests })

    // Check if profile already exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId: session.id as string },
      include: {
        skills: true,
        interests: true,
      },
    })

    let profile

    if (existingProfile) {
      // Update existing profile
      console.log("Updating existing profile:", existingProfile.id)
      
      // First, disconnect all existing skills and interests
      await prisma.userProfile.update({
        where: { id: existingProfile.id },
        data: {
          skills: {
            disconnect: existingProfile.skills.map(skill => ({ id: skill.id })),
          },
          interests: {
            disconnect: existingProfile.interests.map(interest => ({ id: interest.id })),
          },
        },
      })
      
      // Then update the profile with new data
      profile = await prisma.userProfile.update({
        where: { id: existingProfile.id },
        data: {
          age: Number(age),
          gender,
          educationLevel,
          experience,
          careerPreferences,
        },
      })
    } else {
      // Create new profile
      console.log("Creating new profile")
      profile = await prisma.userProfile.create({
        data: {
          userId: session.id as string,
          age: Number(age),
          gender,
          educationLevel,
          experience,
          careerPreferences,
        },
      })
    }

    console.log("Profile saved:", profile.id)

    // Handle skills - create if they don't exist and connect them to the profile
    if (skills && skills.length > 0) {
      for (const skillName of skills) {
        // Find or create the skill
        let skill = await prisma.skill.findUnique({
          where: { name: skillName },
        })

        if (!skill) {
          skill = await prisma.skill.create({
            data: { name: skillName },
          })
        }

        // Connect skill to profile
        await prisma.userProfile.update({
          where: { id: profile.id },
          data: {
            skills: {
              connect: { id: skill.id },
            },
          },
        })
      }
    }

    // Handle interests - create if they don't exist and connect them to the profile
    if (interests && interests.length > 0) {
      for (const interestName of interests) {
        // Find or create the interest
        let interest = await prisma.interest.findUnique({
          where: { name: interestName },
        })

        if (!interest) {
          interest = await prisma.interest.create({
            data: { name: interestName },
          })
        }

        // Connect interest to profile
        await prisma.userProfile.update({
          where: { id: profile.id },
          data: {
            interests: {
              connect: { id: interest.id },
            },
          },
        })
      }
    }

    // Update session with hasProfile flag
    const token = await signJwtToken({
      id: session.id,
      email: session.email,
      name: session.name,
      hasProfile: true,
    })

    // Create response
    const response = NextResponse.json({ success: true, profileId: profile.id }, { status: 200 })

    // Update cookie
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Profile save error:", error)
    return NextResponse.json(
      { error: "Something went wrong", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const session = await getSession()

    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.id as string },
      include: {
        skills: true,
        interests: true,
      },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Transform the data to match the expected format in the frontend
    return NextResponse.json(
      {
        profile: {
          ...profile,
          skills: profile.skills.map(skill => skill.name),
          interests: profile.interests.map(interest => interest.name),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

