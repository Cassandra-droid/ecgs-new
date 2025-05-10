import { NextRequest, NextResponse } from "next/server"
 // Adjust this import path if needed
import { verifyTokenFromCookie } from "@/lib/auth"
export async function POST(req: NextRequest) {
  try {
    // Verify token from Authorization header
    const token = await verifyTokenFromCookie()

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Send request to Django backend
    const response = await fetch("http://127.0.0.1:8000/api/save/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error saving career prediction:", error)
    return NextResponse.json({ error: "Failed to save career prediction" }, { status: 500 })
  }
}
