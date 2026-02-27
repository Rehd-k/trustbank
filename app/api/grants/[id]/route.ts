import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Grant } from "@/lib/models";
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
    const grant = await Grant.findOne({ _id: id, userId }).populate("accountId").lean();
    if (!grant) return NextResponse.json({ error: "Grant not found" }, { status: 404 });
    return NextResponse.json(grant);
  } catch (e) {
    console.error("Get grant error:", e);
    return NextResponse.json({ error: "Failed to get grant" }, { status: 500 });
  }
}

const UpdateSchema = z.object({
  status: z.enum(["pending", "approved", "disbursed", "rejected"]).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    await connectDB();
    const grant = await Grant.findOneAndUpdate(
      { _id: id, userId },
      { $set: parsed.data },
      { new: true }
    ).lean();
    if (!grant) return NextResponse.json({ error: "Grant not found" }, { status: 404 });
    return NextResponse.json(grant);
  } catch (e) {
    console.error("Update grant error:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
