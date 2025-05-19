import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 })
    }

    // Set the token in a cookie
    cookies().set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in auth API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
