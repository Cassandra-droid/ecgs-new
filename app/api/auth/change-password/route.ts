import { NextResponse } from "next/server"
import { api, getAuthToken, handleApiError } from "@/lib/api"
import axios from "axios"

export async function PUT(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json()
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await api.put(
      "/api/auth/change-password/",
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return NextResponse.json({ message: "Password changed successfully" }, { status: 200 })
  } catch (error) {
    const errorResponse = handleApiError(error)

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        return NextResponse.json({ error: "Current password is wrong" }, { status: 400 })
      } else if (error.response?.status === 404) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
