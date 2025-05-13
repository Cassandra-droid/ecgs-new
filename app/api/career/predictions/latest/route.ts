import { type NextRequest, NextResponse } from "next/server"
import { api, getAuthToken } from "@/lib/api"
import axios from "axios"

export async function GET(req: NextRequest) {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await api.get("/api/latest/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error in latest-prediction route:", error)

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return NextResponse.json({ results: [] })
    }

    return NextResponse.json({ error: "Failed to fetch latest prediction" }, { status: 500 })
  }
}
