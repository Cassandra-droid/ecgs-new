"use client"

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

interface User {
  id?: string
  username: string
  email: string
  image?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  const checkAuth = async (): Promise<boolean> => {
    try {
      const response = await axios.get("http://localhost:8000/api/me/", {
        withCredentials: true,
      })
      setUser(response.data)
      return true
    } catch (error) {
      setUser(null)
      return false
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
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
      const userResponse = await axios.get("http://localhost:8000/api/me/", {
        withCredentials: true,
      })
      setUser(userResponse.data)
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await axios.post("http://localhost:8000/api/logout/", {}, { withCredentials: true })
      setUser(null)
      router.push("/sign-in")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
