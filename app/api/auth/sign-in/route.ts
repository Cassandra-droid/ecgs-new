import { NextResponse } from "next/server"
import { api } from "@/lib/api"
import { cookies } from "next/headers"
import axios from "axios"

export async function POST(request: Request) {
  try {
    const { email, password, callbackUrl } = await request.json()

    const response = await api.post("/api/auth/login/", {
      email,
      password,
    })

    // Set the auth token in cookies
    const token = response.data.token
    cookies().set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Determine redirect URL based on user role
    const role = response.data.user?.role
    const redirectUrl = role === "Admin" ? "/admin" : "/dashboard"
    const finalCallbackUrl = callbackUrl && callbackUrl !== "" ? callbackUrl : redirectUrl

    return NextResponse.json({ callbackUrl: finalCallbackUrl })
  } catch (error) {
    console.error("Login error:", error)

    if (axios.isAxiosError(error) && error.response?.status === 400) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
// This code defines a POST API route for handling user login.