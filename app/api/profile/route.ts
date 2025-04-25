// app/api/profile/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { getServerSession, signJwtToken } from "@/lib/auth"
import pool from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      age,
      gender,
      educationLevel,
      experience,
      careerPreferences,
      skills,
      interests,
    } = await request.json()

    const client = await pool.connect()

    try {
      await client.query("BEGIN")

      // Check if profile exists
      const { rows: existingRows } = await client.query(
        `SELECT id FROM user_profiles WHERE user_id = $1`,
        [session.id]
      )

      let profileId: string

      if (existingRows.length > 0) {
        profileId = existingRows[0].id

        await client.query(
          `UPDATE user_profiles
           SET age = $1, gender = $2, education_level = $3, experience = $4, career_preferences = $5
           WHERE id = $6`,
          [age, gender, educationLevel, experience, careerPreferences, profileId]
        )

        // Disconnect previous skills & interests
        await client.query(`DELETE FROM user_profile_skills WHERE profile_id = $1`, [profileId])
        await client.query(`DELETE FROM user_profile_interests WHERE profile_id = $1`, [profileId])
      } else {
        const result = await client.query(
          `INSERT INTO user_profiles (user_id, age, gender, education_level, experience, career_preferences)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
          [session.id, age, gender, educationLevel, experience, careerPreferences]
        )
        profileId = result.rows[0].id
      }

      // Handle skills
      for (const { name, level } of skills || []) {
        let skillId

        const skillRes = await client.query(
          `SELECT id FROM skills WHERE name = $1 AND level IS NOT DISTINCT FROM $2`,
          [name, level]
        )

        if (skillRes.rows.length > 0) {
          skillId = skillRes.rows[0].id
        } else {
          const newSkill = await client.query(
            `INSERT INTO skills (name, level) VALUES ($1, $2) RETURNING id`,
            [name, level]
          )
          skillId = newSkill.rows[0].id
        }

        await client.query(
          `INSERT INTO user_profile_skills (profile_id, skill_id) VALUES ($1, $2)`,
          [profileId, skillId]
        )
      }

      // Handle interests
      for (const { name, category } of interests || []) {
        let interestId

        const interestRes = await client.query(
          `SELECT id FROM interests WHERE name = $1 AND category IS NOT DISTINCT FROM $2`,
          [name, category]
        )

        if (interestRes.rows.length > 0) {
          interestId = interestRes.rows[0].id
        } else {
          const newInterest = await client.query(
            `INSERT INTO interests (name, category) VALUES ($1, $2) RETURNING id`,
            [name, category]
          )
          interestId = newInterest.rows[0].id
        }

        await client.query(
          `INSERT INTO user_profile_interests (profile_id, interest_id) VALUES ($1, $2)`,
          [profileId, interestId]
        )
      }

      await client.query("COMMIT")

      // JWT with hasProfile flag
      const token = await signJwtToken({
        id: session.id,
        email: session.email,
        name: session.name,
        hasProfile: true,
      })

      const response = NextResponse.json({ success: true, profileId }, { status: 200 })

      response.cookies.set({
        name: "auth-token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })

      return response
    } catch (e) {
      await client.query("ROLLBACK")
      throw e
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Profile POST error:", error)
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await pool.connect()

    const result = await client.query(
      `SELECT * FROM user_profiles WHERE user_id = $1`,
      [session.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const profile = result.rows[0]

    const skillsRes = await client.query(
      `SELECT s.name FROM skills s
       JOIN user_profile_skills ups ON ups.skill_id = s.id
       WHERE ups.profile_id = $1`,
      [profile.id]
    )

    const interestsRes = await client.query(
      `SELECT i.name FROM interests i
       JOIN user_profile_interests upi ON upi.interest_id = i.id
       WHERE upi.profile_id = $1`,
      [profile.id]
    )

    client.release()

    return NextResponse.json({
      profile: {
        ...profile,
        skills: skillsRes.rows.map(row => row.name),
        interests: interestsRes.rows.map(row => row.name),
      },
    })
  } catch (error) {
    console.error("Profile GET error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}


