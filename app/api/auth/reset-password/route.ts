import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: Request) {
  try {
    const { email, token, newPassword } = await request.json();

    const client = await pool.connect();

    try {
      // Find user by email, token, and valid expiry
      const result = await client.query(
        `
        SELECT id FROM users
        WHERE email = $1
        AND resetPasswordToken = $2
        AND resetPasswordExpires >= NOW()
      `,
        [email, token]
      );

      const user = result.rows[0];

      if (!user) {
        return new NextResponse("Invalid or expired token", { status: 400 });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password and clear reset fields
      await client.query(
        `
        UPDATE users
        SET password = $1,
            resetPasswordToken = NULL,
            resetPasswordExpires = NULL
        WHERE id = $2
      `,
        [hashedPassword, user.id]
      );

      return NextResponse.json("Password reset successfully");
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    return new NextResponse("Server error", { status: 500 });
  }
}
// This API route handles the password reset process. It verifies the token and updates the user's password in the database.