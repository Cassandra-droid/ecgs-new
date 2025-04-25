import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import pool from "@/lib/db"; // assumes you have pg Pool here

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

interface JWTPayload {
  id: string;
  role: string;
  [key: string]: string | number | boolean;
}

export async function signJwtToken(payload: any) {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);
  } catch (error) {
    console.error("Error signing JWT token:", error);
    throw error;
  }
}

export async function verifyJwtToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log("Verified JWT payload:", JSON.stringify(payload));
    return payload;
  } catch (error) {
    console.error("Error verifying JWT token:", error);
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function createToken(user: { id: string; role: string }): Promise<string> {
  const payload: JWTPayload = { id: user.id, role: user.role };
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1w")
    .sign(JWT_SECRET);
}

export function setAuthCookie(token: string): void {
  cookies().set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function getServerSession() {
  const token = cookies().get("auth_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getCurrentUser() {
  const session = await getServerSession();
  if (!session || typeof session.id !== "string") return null;

  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT id, name, email, image, role FROM users WHERE id = $1",
      [session.id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  } finally {
    client.release();
  }
}

