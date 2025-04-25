import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: Request) {
  try {
    const { email } = await request.json();

    const client = await pool.connect();

    try {
      const result = await client.query(
        `SELECT id FROM users WHERE email = $1`,
        [email]
      );

      const user = result.rows[0];

      if (!user) {
        return new NextResponse("User not found", { status: 404 });
      }

      await client.query(
        `
        UPDATE users
        SET emailVerified = NOW(),
            isEmailVerified = true,
            verificationCode = NULL
        WHERE email = $1
      `,
        [email]
      );

      return new NextResponse("Email verified successfully");
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    return new NextResponse("Something went wrong, No email", { status: 500 });
  }
}
// This API route handles the email verification process. It updates the user's email verification status in the database.