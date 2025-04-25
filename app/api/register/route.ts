import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import pool from "@/lib/db"; // your pg connection pool

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const client = await pool.connect();

    try {
      // Check if user already exists
      const existingUser = await client.query(
        `SELECT id FROM users WHERE email = $1`,
        [email]
      );

      if (existingUser.rows.length > 0) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
      }

      // Hash the password
      const hashedPassword = await hash(password, 10);

      // Insert the new user
      const newUserResult = await client.query(
        `
          INSERT INTO users (name, email, password)
          VALUES ($1, $2, $3)
          RETURNING id, name, email
        `,
        [name, email, hashedPassword]
      );

      const newUser = newUserResult.rows[0];

      return NextResponse.json({ user: newUser });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
// This is a simple registration API route for a Next.js application.