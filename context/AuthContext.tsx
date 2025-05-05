"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

// Define more detailed user interface
interface User {
  id?: string
  username: string
  email: string
  image?: string
  role?: string
}

// Define auth status type for better state management
type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated" | "error"

// Define auth operation type
type AuthOperation = "none" | "login" | "logout" | "refresh" | "signup"

interface AuthState {
  user: User | null
  status: AuthStatus
  error: string | null
  currentOperation: AuthOperation
}

interface AuthContextType {
  // State
  user: User | null
  status: AuthStatus
  error: string | null
  isLoading: boolean
  isAuthenticated: boolean

  // Operation flags
  isLoggingIn: boolean
  isLoggingOut: boolean
  isRefreshing: boolean

  // Methods
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<boolean>
  refreshAuth: () => Promise<boolean>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter()

  // Use a more comprehensive state object
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    status: "idle",
    error: null,
    currentOperation: "none",
  })

  // Derived state properties for easier consumption
  const isLoading = authState.status === "loading"
  const isAuthenticated = authState.status === "authenticated"
  const isLoggingIn = authState.currentOperation === "login" && isLoading
  const isLoggingOut = authState.currentOperation === "logout" && isLoading
  const isRefreshing = authState.currentOperation === "refresh" && isLoading

  // Helper to update auth state
  const updateAuthState = (updates: Partial<AuthState>) => {
    setAuthState((prev) => ({ ...prev, ...updates }))
  }

  // Set user helper that also updates status
  const setUser = (userOrFn: React.SetStateAction<User | null>) => {
    if (typeof userOrFn === "function") {
      setAuthState((prev) => {
        const newUser = userOrFn(prev.user)
        return {
          ...prev,
          user: newUser,
          status: newUser ? "authenticated" : "unauthenticated",
        }
      })
    } else {
      updateAuthState({
        user: userOrFn,
        status: userOrFn ? "authenticated" : "unauthenticated",
      })
    }
  }

  // Clear error helper
  const clearError = () => {
    updateAuthState({ error: null })
  }

  // Login function with better error handling
  const login = async (email: string, password: string): Promise<boolean> => {
    updateAuthState({
      status: "loading",
      currentOperation: "login",
      error: null,
    })

    try {
      // Sign in user
      await axios.post(
        "http://localhost:8000/api/signin/",
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      )

      // Fetch authenticated user data
      const res = await axios.get("http://localhost:8000/api/me/", {
        withCredentials: true,
      })

      updateAuthState({
        user: res.data,
        status: "authenticated",
        currentOperation: "none",
        error: null,
      })

      return true
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Authentication failed"

      updateAuthState({
        user: null,
        status: "error",
        currentOperation: "none",
        error: errorMessage,
      })

      return false
    }
  }

  // Logout function with better error handling
  const logout = async (): Promise<boolean> => {
    updateAuthState({
      status: "loading",
      currentOperation: "logout",
      error: null,
    })

    try {
      await axios.post("http://localhost:8000/api/logout/", {}, { withCredentials: true })

      updateAuthState({
        user: null,
        status: "unauthenticated",
        currentOperation: "none",
        error: null,
      })

      router.push("/sign-in")
      return true
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Logout failed"

      updateAuthState({
        status: "error",
        currentOperation: "none",
        error: errorMessage,
      })

      return false
    }
  }

  // Refresh auth state function
  const refreshAuth = async (): Promise<boolean> => {
    updateAuthState({
      status: "loading",
      currentOperation: "refresh",
      error: null,
    })

    try {
      const response = await axios.get("http://localhost:8000/api/me/", {
        withCredentials: true,
      })

      updateAuthState({
        user: response.data,
        status: "authenticated",
        currentOperation: "none",
        error: null,
      })

      return true
    } catch (error: any) {
      updateAuthState({
        user: null,
        status: "unauthenticated",
        currentOperation: "none",
        error: null, // Don't set error on refresh failures
      })

      return false
    }
  }

  // Initial auth check on mount
  useEffect(() => {
    const checkAuth = async () => {
      updateAuthState({
        status: "loading",
        currentOperation: "refresh",
        error: null,
      })

      try {
        const response = await axios.get("http://localhost:8000/api/me/", {
          withCredentials: true,
        })

        updateAuthState({
          user: response.data,
          status: "authenticated",
          currentOperation: "none",
          error: null,
        })
      } catch (error) {
        updateAuthState({
          user: null,
          status: "unauthenticated",
          currentOperation: "none",
          error: null, // Don't set error on initial load
        })
      }
    }

    checkAuth()
  }, [])

  // Handle session expiration
  useEffect(() => {
    const handleUnauthorized = (error: any) => {
      if (error.response && error.response.status === 401) {
        // Session expired, clear user state
        updateAuthState({
          user: null,
          status: "unauthenticated",
          currentOperation: "none",
          error: "Session expired. Please log in again.",
        })

        router.push("/sign-in?message=Your session has expired. Please log in again.")
      }
    }

    // Add response interceptor
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        handleUnauthorized(error)
        return Promise.reject(error)
      },
    )

    return () => {
      // Remove interceptor when component unmounts
      axios.interceptors.response.eject(interceptor)
    }
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        status: authState.status,
        error: authState.error,
        isLoading,
        isAuthenticated,
        isLoggingIn,
        isLoggingOut,
        isRefreshing,
        setUser,
        login,
        logout,
        refreshAuth,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
