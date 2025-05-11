"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import axios from "axios"

// Create API instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// API response interface
export interface ApiResponse {
  success: boolean
  message: string
}

// Profile interfaces
export interface UserProfile {
  title: string
  bio: string
  gender: string
  age: number | null
  education_level: string
  experience: string
  career_preferences: string
  location: string
  phone: string
  website: string
  skills: ProfileSkill[]
  education: Education[]
  interests: Interest[]
}

export interface ProfileSkill {
  name: string
  level: string
}

export interface Interest {
  name: string
  category: string
}

export interface Education {
  institution: string
  degree: string
  field?: string
  year: string
  description?: string
}

export interface ProfileHeader {
  name: string
  email?: string
  title?: string
  bio?: string
}

export interface PersonalInfo {
  name: string
  email?: string
  title?: string
  bio?: string
  gender: string
  age?: number | string
  education_level: string
  experience: string
  career_preferences: string
  location: string
  phone: string
  website: string
}

// Default profile setup
const defaultEmptyProfile: UserProfile = {
  title: "",
  bio: "",
  gender: "",
  age: null,
  education_level: "",
  experience: "",
  career_preferences: "",
  location: "",
  phone: "",
  website: "",
  skills: [],
  education: [],
  interests: [],
}

// Add debugging to verifyTokenFromCookie
export async function verifyTokenFromCookie() {
  try {
    // Get the token from the cookie
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      console.error("No auth_token cookie found")
      return null
    }

    console.log("Found token in cookie:", token.substring(0, 10) + "...")

    try {
      const response = await api.post<{ valid: boolean }>("/api/verify-token", { token })
      console.log("Token verification response:", response.data)

      if (response.data.valid) {
        return token
      }
      return null
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Token verification failed:", error.response.data)
      } else {
        console.error("Error verifying token:", error)
      }
      return null
    }
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

// Ensure user profile
export async function ensureUserProfile(token: string): Promise<string> {
  try {
    const response = await api.post<{ profile_id: string }>(
      "/api/ensure-profile/",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data.profile_id
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Failed to ensure user profile:", error.response.data)
    } else {
      console.error("Error ensuring profile:", error)
    }
    throw error
  }
}

// Get user profile
export async function getUserProfile(): Promise<UserProfile> {
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  try {
    const response = await api.get<UserProfile>("/api/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    revalidatePath("/profile")
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Failed to fetch user profile:", error.response.data)
    } else {
      console.error("Error fetching profile:", error)
    }
    throw error
  }
}

// Update profile header only (name + email)
export async function updateProfileHeader(data: ProfileHeader): Promise<ApiResponse> {
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  try {
    const response = await api.patch<ApiResponse>("/api/header/", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    revalidatePath("/profile")
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Failed to update profile header:", error.response.data)
      return { success: false, message: error.response.data.message || "Failed to update profile header" }
    } else {
      console.error("Error updating profile header:", error)
      return { success: false, message: "Failed to update profile header" }
    }
  }
}

// Update personal information
export async function updatePersonalInfo(data: PersonalInfo): Promise<ApiResponse> {
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  // Map frontend field names to backend field names
  const mappedData = {
    name: data.name,
    title: data.title || "",
    bio: data.bio || "",
    gender: data.gender,
    age: data.age,
    education_level: data.education_level,
    experience: data.experience,
    career_preferences: data.career_preferences,
    location: data.location,
    phone: data.phone,
    website: data.website,
  }

  console.log("Mapped personal info data:", mappedData)

  try {
    const response = await api.patch<ApiResponse>("/api/personal-info/", mappedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    revalidatePath("/profile")
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Failed to update profile:", error.response.data)
      return { success: false, message: error.response.data.message || "Failed to update profile" }
    } else {
      console.error("Error updating personal info:", error)
      return { success: false, message: "Failed to update profile" }
    }
  }
}

// Update skills to match ProfileSkill model
export async function updateUserSkills(skills: string[]): Promise<ApiResponse> {
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  try {
    // Format skills as objects with name property to match ProfileSkill model
    const formattedSkills = skills.map((skill) => ({
      name: skill,
      level: "Intermediate", // Default level
    }))

    console.log("Sending skills data:", JSON.stringify({ skills: formattedSkills }))

    const response = await api.put<ApiResponse>(
      "/api/skills/",
      { skills: formattedSkills },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    revalidatePath("/profile")
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Failed to update skills:", error.response.data)
      return { success: false, message: error.response.data.message || "Failed to update skills" }
    } else {
      console.error("Error updating skills:", error)
      return { success: false, message: "Failed to update skills" }
    }
  }
}

// Update interests to match Interest model
export async function updateUserInterests(interests: string[]): Promise<ApiResponse> {
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  try {
    // Format interests as objects with name and category properties
    const formattedInterests = interests.map((interest) => ({
      name: interest,
      category: "Personal", // Default category
    }))

    console.log("Sending interests data:", JSON.stringify({ interests: formattedInterests }))

    const response = await api.put<ApiResponse>(
      "/api/interests/",
      { interests: formattedInterests },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    revalidatePath("/profile")
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Failed to update interests:", error.response.data)
      return { success: false, message: error.response.data.message || "Failed to update interests" }
    } else {
      console.error("Error updating interests:", error)
      return { success: false, message: "Failed to update interests" }
    }
  }
}

// Update education to match Education model
export async function updateEducation(userId: string, educationEntries: Education[]): Promise<ApiResponse> {
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  try {
    console.log("Sending education data:", JSON.stringify({ education: educationEntries }))

    const response = await api.put<ApiResponse>(
      "/api/education/",
      { education: educationEntries },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    revalidatePath("/profile")
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Failed to update education:", error.response.data)
      return { success: false, message: error.response.data.message || "Failed to update education" }
    } else {
      console.error("Error updating education:", error)
      return { success: false, message: "Failed to update education" }
    }
  }
}

// Get education data
export async function getEducation(): Promise<Education[]> {
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  try {
    const response = await api.get<Education[]>("/api/education/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Failed to fetch education:", error.response.data)
    } else {
      console.error("Error fetching education:", error)
    }
    throw error
  }
}
