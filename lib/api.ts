import axios from "axios"
import { cookies } from "next/headers"

// API Instance with dynamic base URL
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Add auth token to requests when available
api.interceptors.request.use(async (config) => {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (error) {
    console.error("Error accessing cookies in API interceptor:", error)
  }

  return config
})

// API response interface
export interface ApiResponse {
  success: boolean
  message: string
}

// Helper function to get token from cookies
export async function getAuthToken() {
  try {
    const cookieStore = cookies()
    return cookieStore.get("auth_token")?.value
  } catch (error) {
    console.error("Error getting auth token from cookies:", error)
    return null
  }
}

// Helper function to handle API errors
export function handleApiError(error: unknown): ApiResponse {
  if (axios.isAxiosError(error) && error.response) {
    console.error("API error:", error.response.data)
    return {
      success: false,
      message: error.response.data.message || error.response.data.error || "Request failed",
    }
  } else {
    console.error("Unexpected error:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}
