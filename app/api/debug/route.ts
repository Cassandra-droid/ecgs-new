import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ session: null, message: "No session found" })
    }

    // Check if user has a profile in the database
    const userId = session.id as string
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    })

    return NextResponse.json({
      session,
      hasProfileInDb: !!profile,
      profile: profile ? { id: profile.id, userId: profile.userId } : null,
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
