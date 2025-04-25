import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new Response("You are not authenticated!", { status: 401 });
    }

    const client = await pool.connect();

    try {
      await client.query("DELETE FROM users WHERE id = $1", [user.id]);

      return new NextResponse("Account deleted successfully", { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error deleting account:", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}
// This code defines a DELETE function that deletes a user's account from the database.