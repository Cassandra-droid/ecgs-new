import { NextResponse } from "next/server"
import { api, handleApiError } from "@/lib/api"
import axios from "axios"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    const response = await api.post("/api/auth/register/", {
      name,
      email,
      password,
    })

    return NextResponse.json({ message: "A verification link was sent to your email" })
  } catch (error) {
    const errorResponse = handleApiError(error)

    if (axios.isAxiosError(error) && error.response?.status === 400) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
// This code defines a POST API route for handling user registration.