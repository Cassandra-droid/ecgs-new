import { getCurrentUser } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json()
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return new Response("You are not authenticated!", { status: 401 })
    }

    const client = await pool.connect()

    try {
      const result = await client.query(
        "SELECT id, password FROM users WHERE id = $1",
        [currentUser.id]
      )

      const user = result.rows[0]

      if (!user) {
        return new NextResponse("User not found", { status: 404 })
      }

      const isCurrentPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
      )

      if (!isCurrentPasswordCorrect) {
        return new NextResponse("Current password is wrong", { status: 400 })
      }

      const newHashedPassword = await bcrypt.hash(newPassword, 10)

      await client.query("UPDATE users SET password = $1 WHERE id = $2", [
        newHashedPassword,
        currentUser.id,
      ])

      return new NextResponse("Password changed successfully", { status: 200 })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error changing password:", error)
    return new NextResponse("Server error", { status: 500 })
  }
}
