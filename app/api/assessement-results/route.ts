import { NextResponse } from "next/server"
import { api, getAuthToken } from "@/lib/api"

export async function GET() {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await api.get("/api/skill-assessment-results", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error in assessment-results API route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
