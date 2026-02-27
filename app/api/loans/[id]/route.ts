import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Loan } from "@/lib/models";
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
    const loan = await Loan.findOne({ _id: id, userId }).populate("accountId").lean();
    if (!loan) return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    return NextResponse.json(loan);
  } catch (e) {
    console.error("Get loan error:", e);
    return NextResponse.json({ error: "Failed to get loan" }, { status: 500 });
  }
}

const UpdateSchema = z.object({
  status: z.enum(["pending", "approved", "disbursed", "active", "repaid", "rejected", "defaulted"]).optional(),
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
    const loan = await Loan.findOneAndUpdate(
      { _id: id, userId },
      { $set: parsed.data },
      { new: true }
    ).lean();
    if (!loan) return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    return NextResponse.json(loan);
  } catch (e) {
    console.error("Update loan error:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
