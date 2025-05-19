// /app/api/auth/sign-in/route.ts
import { NextResponse } from "next/server"
import axios from "axios"

export async function POST(request: Request) {
  try {
    const { email, password, callbackUrl } = await request.json()

    // Forward login request to Django backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signin/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      // This is crucial - allow credentials to pass through
      credentials: "include",
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.error || "Invalid credentials" }, { status: response.status })
    }

    const data = await response.json()
    const redirectUrl = callbackUrl || (data.user?.role === "Admin" ? "/admin" : "/dashboard")

    // Get the Set-Cookie header from Django response
    const cookieHeader = response.headers.get("Set-Cookie")

    // Create response with redirect URL
    const res = NextResponse.json({ callbackUrl: redirectUrl })

    // If there was a Set-Cookie header, forward it
    if (cookieHeader) {
      res.headers.set("Set-Cookie", cookieHeader)
    }

    return res
  } catch (error) {
    console.error("Login error:", error)

    if (axios.isAxiosError(error) && error.response?.status === 400) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
