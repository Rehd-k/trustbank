import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Mail } from "@/lib/models";
import { getUserIdFromRequest } from "@/lib/apiHelpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await connectDB();
    const mail = await Mail.findOneAndUpdate(
      { _id: id, userId },
      { $set: { read: true } },
      { new: true }
    ).lean();
    if (!mail) return NextResponse.json({ error: "Mail not found" }, { status: 404 });
    return NextResponse.json(mail);
  } catch (e) {
    console.error("Get mail error:", e);
    return NextResponse.json({ error: "Failed to get mail" }, { status: 500 });
  }
}
