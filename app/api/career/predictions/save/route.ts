import { type NextRequest, NextResponse } from "next/server"
import { api, getAuthToken } from "@/lib/api"

export async function POST(req: NextRequest) {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const response = await api.post("/api/save/", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error saving career prediction:", error)
    return NextResponse.json({ error: "Failed to save career prediction" }, { status: 500 })
  }
}
// This code defines a POST API route for saving career predictions.