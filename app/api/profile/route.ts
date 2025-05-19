import { type NextRequest, NextResponse } from "next/server"
import { api, getAuthToken } from "@/lib/api"
import { cookies } from "next/headers"
import axios from "axios"

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profileData = await request.json()

    const response = await api.post("/api/profile/", profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Update the token if the backend provides a new one with hasProfile flag
    if (response.data.token) {
      cookies().set({
        name: "auth_token",
        value: response.data.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })
    }

    return NextResponse.json(
      {
        success: true,
        profileId: response.data.profileId,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Profile POST error:", error)
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await api.get("/api/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Profile GET error:", error)

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
