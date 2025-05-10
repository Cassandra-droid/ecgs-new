import { NextRequest, NextResponse } from "next/server" 
import { verifyTokenFromCookie } from "@/lib/auth"// Adjust if function is named differently

export async function GET(req: NextRequest) {
  try {
    // Extract and verify token from Authorization header
    const token = await verifyTokenFromCookie()

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Make request to Django backend with token
    const response = await fetch("http://127.0.0.1:8000/api/latest/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })

    if (response.status === 404) {
      return NextResponse.json({ results: [] })
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in latest-prediction route:", error)
    return NextResponse.json({ error: "Failed to fetch latest prediction" }, { status: 500 })
  }
}
