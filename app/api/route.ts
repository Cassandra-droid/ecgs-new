import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Make sure this matches EXACTLY the secret used in your backend
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "oGqOHOxYPRP28PEsygbtQ3OLYljcrHh3MxwqpFiStt8k")

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 })
    }

    // Set the token in a cookie
    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed from strict to lax to allow cross-domain
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in auth API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
