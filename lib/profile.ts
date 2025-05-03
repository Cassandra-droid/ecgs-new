"use server"

import { revalidatePath } from "next/cache"
import pool from "@/lib/db"
import { getServerSession } from "@/lib/auth"

// Utility
async function getSession() {
  const session = await getServerSession()
  if (!session || !session.user) throw new Error("Unauthorized")
  return session
}

// Default profile
const defaultEmptyProfile = {
  title: "",
  bio: "",
  gender: "",
  age: null,
  educationLevel: "",
  experience: "",
  careerPreferences: "",
  location: "",
  phone: "",
  website: "",
  skills: [],
  education: [],
  interests: [],
}

export async function ensureUserProfile(token: string) {
  try {
    const res = await fetch('http://localhost:8000/api/ensure-profile/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    if (!res.ok) throw new Error("Failed to ensure user profile")

    const data = await res.json()
    return data.profile_id
  } catch (error) {
    console.error("Error ensuring profile:", error)
    throw error
  }
}

// Get user profile from Django backend
export async function getUserProfile(token: string) {
  try {
    const res = await fetch('http://localhost:8000/api/profile/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error('Failed to fetch user profile')
    }

    const profile = await res.json()
    return profile
  } catch (error) {
    console.error("Error fetching profile:", error)
    throw error
  }
}

// Update profile header (name, title, bio)
export async function updateProfileHeader(data: {
  name: string
  title: string
  bio: string
}) {
  const res = await fetch("http://localhost:8000/api/header/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // send cookies for session auth
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error("Backend error:", errorText)
    throw new Error("Failed to update profile header")
  }

  return await res.json()
}

// Update personal info
export async function updatePersonalInfo(data: {
  name: string
  email: string
  title: string
  bio: string
  gender: string
  age?: number | string
  educationLevel: string
  experience: string
  careerPreferences: string
  location: string
  phone: string
  website: string
}) {
  const res = await fetch("http://localhost:8000/api/personal-info/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Ensures cookies are sent
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    console.error("Failed to update profile:", await res.text())
    throw new Error("Failed to update profile")
  }

  return await res.json()
}


// Update skills
export async function updateUserSkills(skills: { name: string; level: string }[]) {
  try {
    const response = await fetch("http://localhost:8000/api/skills/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // <- this is important for cookies/session auth
      body: JSON.stringify({ skills }),
    })

    if (!response.ok) {
      throw new Error("Failed to update skills")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating skills:", error)
    throw error
  }
}


// Update interests
export async function updateUserInterests(interests: string[]) {
  try {
    const formattedInterests = interests.map((interest) => ({
      name: interest,
      category: "Personal", // or allow custom categories if needed
    }))

    const response = await fetch("http://localhost:8000/api/interests/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 👈 include cookies for authentication
      body: JSON.stringify({ interests: formattedInterests }),
    })

    if (!response.ok) {
      throw new Error("Failed to update interests")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating interests:", error)
    throw error
  }
}


// Update education
export async function updateEducation(educationEntries: { institution: string; degree: string; year: string }[]) {
  try {
    const response = await fetch("http://localhost:8000/api/education/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 👈 sends cookies
      body: JSON.stringify({ education: educationEntries }),
    })

    if (!response.ok) {
      throw new Error("Failed to update education")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating education:", error)
    throw error
  }
}
