import { type NextRequest, NextResponse } from "next/server"
import { api } from "@/lib/api"
import axios from "axios"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 })
    }

    const response = await api.post("/api/verify-token", { token })
    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error in verify-token API route:", error)

    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { error: error.response?.data?.error || "Token verification failed" },
        { status: error.response?.status || 500 },
      )
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
