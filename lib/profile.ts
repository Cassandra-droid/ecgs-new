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

// Ensure profile exists and return ID
async function ensureUserProfile(userId: string) {
  const client = await pool.connect()
  try {
    const res = await client.query(
      `SELECT id FROM user_profiles WHERE user_id = $1`,
      [userId]
    )
    if (res.rowCount && res.rowCount > 0) return res.rows[0].id

    const insertRes = await client.query(
      `INSERT INTO user_profiles (user_id) VALUES ($1) RETURNING id`,
      [userId]
    )
    return insertRes.rows[0].id
  } finally {
    client.release()
  }
}

// Get user profile with skills, interests, education
export async function getUserProfile(userId: string | undefined) {
  if (!userId) return null

  try {
    const client = await pool.connect()
    try {
      const userRes = await client.query(`
        SELECT u.name, p.*, 
          COALESCE(json_agg(DISTINCT s) FILTER (WHERE s.id IS NOT NULL), '[]') as skills,
          COALESCE(json_agg(DISTINCT i) FILTER (WHERE i.id IS NOT NULL), '[]') as interests,
          COALESCE(json_agg(DISTINCT e) FILTER (WHERE e.id IS NOT NULL), '[]') as education
        FROM users u
        LEFT JOIN user_profiles p ON u.id = p.user_id
        LEFT JOIN user_profile_skills ups ON p.id = ups.profile_id
        LEFT JOIN skills s ON ups.skill_id = s.id
        LEFT JOIN user_profile_interests upi ON p.id = upi.profile_id
        LEFT JOIN interests i ON upi.interest_id = i.id
        LEFT JOIN education e ON p.id = e.profile_id
        WHERE u.id = $1
        GROUP BY u.name, p.id
      `, [userId])

      const row = userRes.rows[0]
      if (!row) return defaultEmptyProfile

      return {
        title: row.title || "",
        bio: row.bio || "",
        gender: row.gender || "",
        age: row.age,
        educationLevel: row.education_level || "",
        experience: row.experience || "",
        careerPreferences: row.career_preferences || "",
        location: row.location || "",
        phone: row.phone || "",
        website: row.website || "",
        skills: row.skills || [],
        education: row.education || [],
        interests: row.interests || [],
      }
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    throw new Error("Failed to fetch user profile")
  }
}

// Update profile header (name, title, bio)
export async function updateProfileHeader(data: {
  name: string
  title: string
  bio: string
}) {
  const session = await getSession()
  const userId = (session.user as { id: string }).id

  const client = await pool.connect()
  try {
    const profileId = await ensureUserProfile(userId)

    await client.query(`UPDATE users SET name = $1 WHERE id = $2`, [
      data.name,
      userId,
    ])

    await client.query(
      `UPDATE user_profiles SET title = $1, bio = $2 WHERE id = $3`,
      [data.title, data.bio, profileId]
    )

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Failed to update profile header:", error)
    throw new Error("Failed to update profile header")
  } finally {
    client.release()
  }
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
  const session = await getSession()
  const userId = (session.user as { id: string }).id

  const client = await pool.connect()
  try {
    const profileId = await ensureUserProfile(userId)

    await client.query(`UPDATE users SET name = $1 WHERE id = $2`, [
      data.name,
      userId,
    ])

    await client.query(
      `UPDATE user_profiles SET 
        title = $1, bio = $2, gender = $3, age = $4,
        education_level = $5, experience = $6, career_preferences = $7,
        location = $8, phone = $9, website = $10
      WHERE id = $11`,
      [
        data.title,
        data.bio,
        data.gender,
        data.age ? Number(data.age) : null,
        data.educationLevel,
        data.experience,
        data.careerPreferences,
        data.location,
        data.phone,
        data.website,
        profileId,
      ]
    )

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Failed to update personal info:", error)
    throw new Error("Failed to update personal info")
  } finally {
    client.release()
  }
}

// Update skills
export async function updateUserSkills(skills: string[]) {
  const session = await getSession()
  const userId = (session.user as { id: string }).id
  const client = await pool.connect()

  try {
    const profileId = await ensureUserProfile(userId)

    // Remove old
    await client.query(`DELETE FROM user_profile_skills WHERE profile_id = $1`, [profileId])

    for (const skillName of skills) {
      const { rows } = await client.query(
        `INSERT INTO skills (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
        [skillName]
      )

      const skillId = rows[0].id

      await client.query(
        `INSERT INTO user_profile_skills (profile_id, skill_id) VALUES ($1, $2)`,
        [profileId, skillId]
      )
    }

    revalidatePath("/profile")
    return { success: true }
  } finally {
    client.release()
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
