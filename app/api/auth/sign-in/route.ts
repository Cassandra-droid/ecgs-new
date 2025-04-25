// app/api/login/route.ts
import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password, callbackUrl } = await request.json()

    const client = await pool.connect()

    const { rows } = await client.query(
      `SELECT id, email, password, role FROM users WHERE email = $1`,
      [email]
    )

    client.release()

    const user = rows[0]

    if (!user || !user.password) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }

    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }

    const token = await createToken({ id: user.id, role: user.role })
    setAuthCookie(token)

    const redirectUrl = user.role === "Admin" ? "/admin" : "/dashboard"
    const finalCallbackUrl = callbackUrl && callbackUrl !== "" ? callbackUrl : redirectUrl

    return NextResponse.json({ callbackUrl: finalCallbackUrl })
  } catch (error) {
    console.error("Login error:", error)
    return new NextResponse("Server error", { status: 500 })
  }
}

