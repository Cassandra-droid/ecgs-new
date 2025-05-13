import { type NextRequest, NextResponse } from "next/server"
import { api, getAuthToken } from "@/lib/api"

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

    // Properly encode the career title for the URL
    const encodedTitle = encodeURIComponent(careerTitle)

    const response = await api.get(`/api/job/${encodedTitle}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error fetching job listing:", error)
    return NextResponse.json({ error: "Failed to fetch job listing" }, { status: 500 })
  }
}
