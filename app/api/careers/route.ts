import { NextResponse } from "next/server"
import { Pool } from "pg"

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

export async function GET() {
  const client = await pool.connect()

  try {
    // Query to fetch all careers from the database
    // This assumes you have a careers table with JSON/JSONB columns for requiredSkills and keywords
    const result = await client.query(`
      SELECT 
        id, 
        career, 
        category, 
        required_skills AS "requiredSkills", 
        keywords
      FROM careers
      ORDER BY category, career
    `)

    // Return the careers as JSON
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error in careers API route:", error)
    return NextResponse.json({ error: "Failed to fetch careers" }, { status: 500 })
  } finally {
    // Release the client back to the pool
    client.release()
  }
}
