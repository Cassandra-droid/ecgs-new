import { NextResponse } from "next/server"
import { verifyTokenFromCookie } from "@/lib/auth" // adjust the path based on your project structure

export async function GET() {
  try {
    const token = await verifyTokenFromCookie()
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch("http://127.0.0.1:8000/api/skill-assessment-results", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch from backend" }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in assessment-results API route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
