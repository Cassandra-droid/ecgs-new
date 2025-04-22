import { NextResponse } from "next/server"
import { RowDataPacket } from "mysql2"


// GET all careers or filtered careers
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""

    let careers
    if (searchQuery || category) {
      let sql = `SELECT * FROM careers WHERE 1=1`
      const params = []

      if (searchQuery) {
        sql += ` AND (title LIKE ? OR description LIKE ?)`
        params.push(`%${searchQuery}%`, `%${searchQuery}%`)
      }

      if (category) {
        sql += ` AND category = ?`
        params.push(category)
      }

      careers = (await query(sql, params)) as RowDataPacket[]
    } else {
      careers = (await query("SELECT * FROM careers", [])) as RowDataPacket[]
    }

    // For each career, get its skills
    if (Array.isArray(careers)) {
      for (const career of careers) {
        const skills = (await query("SELECT skill FROM career_skills WHERE career_id = ?", [
          career.id,
        ])) as RowDataPacket[]

        career.skills = Array.isArray(skills) ? skills.map((s) => s.skill) : []
      }
    }

    return NextResponse.json({ careers })
  } catch (error) {
    console.error("Error fetching careers:", error)
    return NextResponse.json({ error: "Failed to fetch careers" }, { status: 500 })
  }
}

function query(sql: string, params: string[]): RowDataPacket[] | PromiseLike<RowDataPacket[]> {
  throw new Error("Function not implemented.")
}

