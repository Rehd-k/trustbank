import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { isEmailVerified: true }, $unset: { emailVerificationToken: 1 } },
      { new: true }
    )
      .select("-password -emailVerificationToken")
      .lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (e) {
    console.error("Admin verify user error:", e);
    return NextResponse.json({ error: "Verify failed" }, { status: 500 });
  }
}
