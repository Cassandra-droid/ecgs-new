import { sendPasswordResetLink } from "@/lib/sendPasswordResetEmail";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const client = await pool.connect();

    try {
      // Find user by email
      const userQuery = await client.query(
        "SELECT id, email, password FROM users WHERE email = $1",
        [email]
      );

      const user = userQuery.rows[0];

      if (!user || !user.password) {
        return new NextResponse("That email doesn't exist in our system", {
          status: 404,
        });
      }

      const resetPasswordToken = uuidv4();
      const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

      // Update user with reset token
      await client.query(
        `
        UPDATE users
        SET resetPasswordToken = $1, resetPasswordExpires = $2
        WHERE id = $3
      `,
        [resetPasswordToken, resetPasswordExpires, user.id]
      );

      await sendPasswordResetLink(user.email, resetPasswordToken);

      return new NextResponse(
        "We have sent a password reset link to your email, follow it to reset your password"
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    return new NextResponse("Unable to send an email", { status: 500 });
  }
}
// This API route handles the password reset request. It generates a unique token,
