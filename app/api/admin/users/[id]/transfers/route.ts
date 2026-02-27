import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";

const BodySchema = z.object({ disabled: z.boolean() });

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = BodySchema.safeParse(body);
    const disabled = parsed.success ? parsed.data.disabled : true;
    await connectDB();
    const user = await User.findByIdAndUpdate(id, { transfersDisabled: disabled }, { new: true })
      .select("transfersDisabled")
      .lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ message: disabled ? "Transfers disabled" : "Transfers enabled", transfersDisabled: user.transfersDisabled });
  } catch (e) {
    console.error("Admin transfers toggle error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
