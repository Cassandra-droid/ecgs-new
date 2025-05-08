import { NextRequest, NextResponse } from "next/server";
import { verifyTokenFromCookie } from "@/lib/auth"; // adjust the path if needed

export async function GET(req: NextRequest) {
  try {
    const token = await verifyTokenFromCookie();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch("http://127.0.0.1:8000/api/jobs/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch jobs from backend");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in jobs route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
