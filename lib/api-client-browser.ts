import axios from "axios"

// API Instance with dynamic base URL for client-side use
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Important for cookies to be sent with requests
})

// API response interface
export interface ApiResponse {
  success: boolean
  message: string
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

// Auth-related API functions
export const authApi = {
  login: async (email: string, password: string) => {
    return api.post("/api/signin/", { email, password })
  },

  logout: async () => {
    return api.post("/api/logout/")
  },

  getCurrentUser: async () => {
    return api.get("/api/me/")
  },

  register: async (userData: { username: string; email: string; password: string }) => {
    return api.post("/api/signup/", userData)
  },

  verifyEmail: async (email: string, code: string) => {
    return api.post("/api/verify-email/", { email, code })
  },

  forgotPassword: async (email: string) => {
    return api.post("/api/forgot-password/", { email })
  },

  resetPassword: async (email: string, token: string, newPassword: string) => {
    return api.post("/api/reset-password/", { email, token, newPassword })
  },
}

// Dashboard-related API functions
export const dashboardApi = {
  getDashboardSummary: async () => {
    return api.get("/api/dashboard_summary/")
  },

  getUserEngagementSummary: async () => {
    return api.get("/api/user_engagement_summary/")
  },

  exportPredictionReport: () => {
    return `${api.defaults.baseURL}/api/export_prediction_report/`
  },
}
