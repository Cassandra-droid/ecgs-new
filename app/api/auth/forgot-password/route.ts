import { NextResponse } from "next/server"
import { api, handleApiError } from "@/lib/api"
import axios from "axios"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    const response = await api.post("/api/auth/forgot-password/", { email })

    return NextResponse.json({
      message: "We have sent a password reset link to your email, follow it to reset your password",
    })
  } catch (error) {
    const errorResponse = handleApiError(error)

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return NextResponse.json({ error: "That email doesn't exist in our system" }, { status: 404 })
    }

    return NextResponse.json({ error: "Unable to send an email" }, { status: 500 })
  }
}
// This code defines a POST API route for handling password reset requests.