import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ session: null, message: "No session found" });
    }

    const userId = session.id as string;

    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT id, user_id FROM user_profiles WHERE user_id = $1 LIMIT 1",
        [userId]
      );

      const profile = result.rows[0] || null;

      return NextResponse.json({
        session,
        hasProfileInDb: !!profile,
        profile: profile ? { id: profile.id, userId: profile.user_id } : null,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

