"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

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

    // Verify the token with the server
    const res = await fetch("http://localhost:8000/api/verify-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })

    if (!res.ok) {
      console.error("Token verification failed:", await res.text())
      return null
    }

    const data = await res.json()
    console.log("Token verification response:", data)

    if (data.valid) {
      return token
    }

    return null
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

// Default profile setup
const defaultEmptyProfile = {
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

// Ensure user profile
export async function ensureUserProfile(token: string) {
  try {
    const res = await fetch("http://localhost:8000/api/ensure-profile/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) throw new Error("Failed to ensure user profile")
    const data = await res.json()
    return data.profile_id
  } catch (error) {
    console.error("Error ensuring profile:", error)
    throw error
  }
}

// Get user profile
export async function getUserProfile() {
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  try {
    const res = await fetch("http://localhost:8000/api/profile/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })

    if (!res.ok) throw new Error("Failed to fetch user profile")
    const profile = await res.json()
    revalidatePath("/profile")
    return profile
  } catch (error) {
    console.error("Error fetching profile:", error)
    throw error
  }
}

// Update profile header only (name + email)
export async function updateProfileHeader(data: { name: string; email?: string; title?: string; bio?: string }) {
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  try {
    const res = await fetch("http://localhost:8000/api/header/", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("Failed to update profile header:", errorText)
      throw new Error("Failed to update profile header")
    }

    const result = await res.json()
    revalidatePath("/profile")
    return result
  } catch (error) {
    console.error("Error updating profile header:", error)
    throw error
  }
}

// Update personal information
export async function updatePersonalInfo(data: {
  name: string
  email?: string
  title?: string
  bio?: string
  gender: string
  age?: number | string
  educationLevel: string
  experience: string
  careerPreferences: string
  location: string
  phone: string
  website: string
}) {
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  // Map frontend field names to backend field names
  const mappedData = {
    name: data.name,
    title: data.title || "",
    bio: data.bio || "",
    gender: data.gender,
    age: data.age,
    education_level: data.educationLevel,
    experience: data.experience,
    career_preferences: data.careerPreferences,
    location: data.location,
    phone: data.phone,
    website: data.website,
  }

  console.log("Mapped personal info data:", mappedData)

  try {
    const res = await fetch("http://localhost:8000/api/personal-info/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(mappedData),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("Failed to update profile:", errorText)
      throw new Error("Failed to update profile")
    }

    const result = await res.json()
    revalidatePath("/profile")
    return result
  } catch (error) {
    console.error("Error updating personal info:", error)
    throw error
  }
}

// Update skills to match ProfileSkill model
export async function updateUserSkills(skills: string[]) {
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  try {
    // Format skills as objects with name property to match ProfileSkill model
    const formattedSkills = skills.map((skill) => ({
      name: skill,
      level: "Intermediate", // Default level
    }))

    console.log("Sending skills data:", JSON.stringify({ skills: formattedSkills }))

    const response = await fetch("http://localhost:8000/api/skills/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ skills: formattedSkills }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Failed to update skills:", errorText)
      throw new Error("Failed to update skills")
    }

    const result = await response.json()
    revalidatePath("/profile")
    return result
  } catch (error) {
    console.error("Error updating skills:", error)
    throw error
  }
}

// Update interests to match Interest model
export async function updateUserInterests(interests: string[]) {
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  try {
    // Format interests as objects with name and category properties
    const formattedInterests = interests.map((interest) => ({
      name: interest,
      category: "Personal", // Default category
    }))

    console.log("Sending interests data:", JSON.stringify({ interests: formattedInterests }))

    const response = await fetch("http://localhost:8000/api/interests/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ interests: formattedInterests }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Failed to update interests:", errorText)
      throw new Error("Failed to update interests")
    }

    const result = await response.json()
    revalidatePath("/profile")
    return result
  } catch (error) {
    console.error("Error updating interests:", error)
    throw error
  }
}

// Update education to match Education model
export async function updateEducation(
  userId: string,
  educationEntries: { institution: string; degree: string; field?: string; year: string; description?: string }[],
) {
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  try {
    console.log("Sending education data:", JSON.stringify({ education: educationEntries }))

    const response = await fetch("http://localhost:8000/api/education/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ education: educationEntries }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Failed to update education:", errorText)
      throw new Error("Failed to update education")
    }

    const result = await response.json()
    revalidatePath("/profile")
    return result
  } catch (error) {
    console.error("Error updating education:", error)
    throw error
  }
}

// Get education data
export async function getEducation() {
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  const res = await fetch("http://localhost:8000/api/education/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  })

  if (!res.ok) throw new Error("Failed to fetch education")
  return await res.json()
}
