import { NextResponse } from "next/server"
import { api } from "@/lib/api"
import { serialize } from "cookie"
import axios from "axios"

export async function POST(request: Request) {
  try {
    const { email, password, callbackUrl } = await request.json()

    const response = await api.post(
      "/api/auth/login/",
      { email, password },
      { withCredentials: true }
    )

    const token = response.data.token

    const cookie = serialize("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    const role = response.data.user?.role
    const defaultRedirect = role === "Admin" ? "/admin" : "/dashboard"
    const finalCallbackUrl = callbackUrl && callbackUrl !== "" ? callbackUrl : defaultRedirect

    // ✅ Redirect instead of JSON
    const res = NextResponse.redirect(new URL(finalCallbackUrl, request.url))
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
