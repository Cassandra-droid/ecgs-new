// Create this file if it doesn't exist
'use server'

import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "oGqOHOxYPRP28PEsygbtQ3OLYljcrHh3MxwqpFiStt8k")

export async function getCurrentUser() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}



export async function verifyTokenFromCookie(): Promise<string | null> {
  const token = cookies().get("auth_token")?.value

  if (!token) return null

  try {
    const res = await fetch("http://localhost:8000/api/verify-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })

    if (!res.ok) return null

    const data = await res.json()
    return data?.valid ? token : null
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}
