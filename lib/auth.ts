import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { api } from "./api"
import { cache } from "react"

// Get the auth token from cookies
export async function getAuthToken() {
  try {
    const cookieStore = cookies()
    return cookieStore.get("auth_token")?.value
  } catch (error) {
    console.error("Error getting auth token from cookies:", error)
    return null
  }
}

// Verify the token from cookies
export async function verifyTokenFromCookie() {
  const token = await getAuthToken()
  if (!token) return null

  try {
    await api.post("/api/verify-token", { token })
    return token
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

// Get the current user session
export const getServerSession = cache(async () => {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await api.get("/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    console.error("Error getting server session:", error)
    return null
  }
})

// Get the current user
export const getCurrentUser = cache(async () => {
  try {
    const session = await getServerSession()
    return session
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
})

// Set auth cookie
export function setAuthCookie(token: string) {
  cookies().set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })
}

// Verify session and redirect if not authenticated
export async function verifySession() {
  const session = await getServerSession()

  if (!session?.id) {
    redirect("/sign-in")
  }

  return { isAuth: true, userId: session.id }
}
