import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { deleteSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const token = getBearerToken(request.headers.get("authorization"));
  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }
  try {
    await connectDB();
    await deleteSession(token);
    return NextResponse.json({ message: "Logged out successfully" });
  } catch (e) {
    console.error("Logout error:", e);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
