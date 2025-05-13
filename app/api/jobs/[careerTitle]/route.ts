import { type NextRequest, NextResponse } from "next/server"
import { getAuthToken } from "@/lib/api"
import {api} from "@/lib/api"
import axios from "axios"

export async function GET(req: NextRequest, { params }: { params: { careerTitle: string } }) {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const careerTitle = params.careerTitle

    if (!careerTitle) {
      return NextResponse.json({ error: "Career title is required" }, { status: 400 })
    }

    try {
      const response = await api.get(`/api/job/${encodeURIComponent(careerTitle)}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return NextResponse.json(response.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return NextResponse.json(
            { error: error.response.data.message || "API error" },
            { status: error.response.status },
          )
        }
      }
      throw error
    }
  } catch (error) {
    console.error("Error fetching job listing:", error)
    return NextResponse.json({ error: "Failed to fetch job listing" }, { status: 500 })
  }
}
