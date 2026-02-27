import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Transaction } from "@/lib/models";

const UpdateSchema = z.object({
  status: z.enum(["pending", "completed", "failed", "reversed"]).optional(),
});

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  try {
    await connectDB();
    const tx = await Transaction.findById(id).lean();
    if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    return NextResponse.json(tx);
  } catch (e) {
    console.error("Admin get transaction error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  try {
    const body = await request.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    await connectDB();
    const tx = await Transaction.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
    if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    return NextResponse.json(tx);
  } catch (e) {
    console.error("Admin update transaction error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
