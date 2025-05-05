// Create this file if it doesn't exist
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
