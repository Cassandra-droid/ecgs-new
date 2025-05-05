// This file provides a way to bypass the middleware for testing purposes
import { cookies } from "next/headers"

export async function getCurrentUser() {
  try {
    // Make a direct request to your backend API to get the current user
    const response = await fetch("http://localhost:8000/api/me", {
      headers: {
        Cookie: cookies().toString(),
      },
      credentials: "include",
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching current user:", error)
    return null
  }
}
