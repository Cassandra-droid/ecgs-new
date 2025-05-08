"use server"

import { revalidatePath } from "next/cache"
import { verifyTokenFromCookie } from "@/lib/auth"

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

// Get user profile from Django backend
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

    if (!res.ok) {
      throw new Error("Failed to fetch user profile")
    }

    const profile = await res.json()
    revalidatePath("/profile")
    return profile
  } catch (error) {
    console.error("Error fetching profile:", error)
    throw error
  }
}

export async function updateProfileHeader(data: {
  name: string
  title: string
  bio: string
}) {
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  const res = await fetch("http://localhost:8000/api/header/", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Failed to update profile header")

  const result = await res.json()
  revalidatePath("/profile")
  return result
}

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
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  try {
    const res = await fetch("http://localhost:8000/api/personal-info/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      console.error("Failed to update profile:", await res.text())
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

export async function updateUserSkills(skills: { name: string; level: string }[]) {
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  try {
    const response = await fetch("http://localhost:8000/api/skills/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ skills }),
    })

    if (!response.ok) {
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

export async function updateUserInterests(interests: string[]) {
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  try {
    const formattedInterests = interests.map((interest) => ({
      name: interest,
      category: "Personal",
    }))

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

export async function updateEducation(
  userId: string,
  educationEntries: { institution: string; degree: string; year: string }[],
) {
  const token = await verifyTokenFromCookie()
  if (!token) throw new Error("Invalid or missing token")

  try {
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
