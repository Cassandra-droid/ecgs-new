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
    // Query to fetch all skills from the database
    const result = await client.query(`
      SELECT id, name, type 
      FROM skills 
      ORDER BY type, name
    `)

    // Return the skills as JSON
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error in skills API route:", error)
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 })
  } finally {
    // Release the client back to the pool
    client.release()
  }
}
