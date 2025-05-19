// /app/api/signin/route.ts
import { NextResponse } from "next/server"
import { api } from "@/lib/api"
import { serialize } from "cookie"
import axios from "axios"

export async function POST(request: Request) {
  try {
    const { email, password, callbackUrl } = await request.json()

    const response = await api.post("/api/auth/login/", { email, password })

    const token = response.data.token
    const role = response.data.user?.role
    const redirectUrl = callbackUrl || (role === "Admin" ? "/admin" : "/dashboard")

    const cookie = serialize("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    const res = NextResponse.json({ callbackUrl: redirectUrl })
    res.headers.set("Set-Cookie", cookie)
    return res
  } catch (error) {
    console.error("Login error:", error)

    if (axios.isAxiosError(error) && error.response?.status === 400) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
