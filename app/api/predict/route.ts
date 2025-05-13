import { type NextRequest, NextResponse } from "next/server"
import { api, getAuthToken } from "@/lib/api"

export async function POST(req: NextRequest) {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const response = await api.post("/api/predict/", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error in predict-careers route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
// This code defines a POST API route for making career predictions.