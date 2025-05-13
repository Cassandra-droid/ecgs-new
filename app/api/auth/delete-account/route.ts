import { NextResponse } from "next/server"
import { api, getAuthToken } from "@/lib/api"

export async function DELETE() {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await api.delete("/api/auth/delete-account/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}
// This code defines a DELETE API route for deleting a user account.