import { NextResponse } from "next/server"
import { api } from "@/lib/api"
import { serialize } from "cookie"
import axios from "axios"

export async function POST(request: Request) {
  try {
    const { email, password, callbackUrl } = await request.json()

    // Send credentials to your backend API
    const response = await api.post("/api/auth/login/", {
      email,
      password,
    })

    const token = response.data.token

    // Serialize the cookie manually
    const cookie = serialize("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Determine redirect destination
    const role = response.data.user?.role
    const defaultRedirect = role === "Admin" ? "/admin" : "/dashboard"
    const finalCallbackUrl = callbackUrl && callbackUrl !== "" ? callbackUrl : defaultRedirect

    // Create the response with Set-Cookie header
    const res = NextResponse.json({ callbackUrl: finalCallbackUrl })
    res.headers.set("Set-Cookie", cookie)
    return res
  } catch (error) {
    console.error("Login error:", error)

    if (axios.isAxiosError(error) && error.response?.status === 400) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
