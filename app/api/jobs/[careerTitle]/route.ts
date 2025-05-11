import { NextRequest, NextResponse } from "next/server"
import { verifyTokenFromCookie } from "@/lib/auth" // adjust path if needed

export async function GET(req: NextRequest, { params }: { params: { careerTitle: string } }) {
  try {
    const token = await verifyTokenFromCookie()

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const careerTitle = params.careerTitle

    if (!careerTitle) {
      return NextResponse.json({ error: "Career title is required" }, { status: 400 })
    }

    // Properly encode the career title for the URL
    const encodedTitle = encodeURIComponent(careerTitle)

    // Make a request to Django backend with Bearer token
    const response = await fetch(`http://127.0.0.1:8000/api/job/${encodedTitle}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching job listing:", error)
    return NextResponse.json({ error: "Failed to fetch job listing" }, { status: 500 })
  }
}
