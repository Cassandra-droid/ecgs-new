import { NextResponse } from "next/server"
import { api, handleApiError } from "@/lib/api"
import axios from "axios"

export async function PUT(request: Request) {
  try {
    const { email, token, newPassword } = await request.json()

    const response = await api.put("/api/auth/reset-password/", {
      email,
      token,
      newPassword,
    })

    return NextResponse.json({ message: "Password reset successfully" })
  } catch (error) {
    const errorResponse = handleApiError(error)

    if (axios.isAxiosError(error) && error.response?.status === 400) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
// This code defines a PUT API route for resetting a user's password.