import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";

const BodySchema = z.object({ block: z.boolean() });

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = BodySchema.safeParse(body);
    const block = parsed.success ? parsed.data.block : true;
    await connectDB();
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.role === "admin") return NextResponse.json({ error: "Cannot block an admin" }, { status: 400 });
    user.isBlocked = block;
    await user.save();
    return NextResponse.json({ message: block ? "User blocked" : "User unblocked", isBlocked: user.isBlocked });
  } catch (e) {
    console.error("Admin block user error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
