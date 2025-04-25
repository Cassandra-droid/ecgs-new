import { getCurrentUser } from "@/lib/auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET the current user
export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return new NextResponse("Not authenticated", { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  });
}

// PATCH to update user profile
export async function PATCH(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedData = await req.json();
    const allowedFields = ["name", "email", "image"];

    const fieldsToUpdate = Object.keys(updatedData).filter(field =>
      allowedFields.includes(field)
    );

    if (fieldsToUpdate.length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const values = fieldsToUpdate.map(field => updatedData[field]);
    const setClause = fieldsToUpdate.map((field, index) => `${field} = $${index + 1}`).join(", ");

    const query = `
      UPDATE users
      SET ${setClause}
      WHERE id = $${fieldsToUpdate.length + 1}
      RETURNING id, name, email, image, role
    `;

    const client = await pool.connect();
    try {
      const result = await client.query(query, [...values, currentUser.id]);
      const updatedUser = result.rows[0];

      return NextResponse.json(updatedUser);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Failed to update user", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

