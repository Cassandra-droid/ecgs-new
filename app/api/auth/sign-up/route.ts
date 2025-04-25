// app/api/signup/route.ts
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import crypto from "crypto";
import { sendEmailVerification } from "@/lib/sendEmailVerificationEmail";
import pool from "@/lib/db"; // PostgreSQL connection using pg Pool

export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const { name, email, password } = await request.json();

    // Check if user already exists
    const existingUserQuery = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUserQuery.rowCount && existingUserQuery.rowCount > 0) {
      return new NextResponse("Email already exists", { status: 400 });
    }

    // Hash the password and generate a verification code
    const hashedPassword = await hashPassword(password);
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Insert new user
    await client.query(
      `INSERT INTO users (name, email, password, verification_code) 
       VALUES ($1, $2, $3, $4)`,
      [name, email, hashedPassword, verificationCode]
    );

    // Optional: send email verification
    // await sendEmailVerification(email, verificationCode);

    return NextResponse.json("A verification link was sent to your email");
  } catch (error: any) {
    console.error("Signup error:", error.message);
    return new NextResponse("Server error", { status: 500 });
  } finally {
    client.release(); // Always release the client
  }
}
