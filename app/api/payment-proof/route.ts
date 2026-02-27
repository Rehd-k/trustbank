import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { PaymentProof } from "@/lib/models";
import { getUserIdFromRequest } from "@/lib/apiHelpers";

const CreateSchema = z.object({
  fileUrl: z.string().url(),
  fileName: z.string(),
  fileSize: z.number().int().positive(),
  mimeType: z.string(),
  transactionId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const list = await PaymentProof.find({ userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(list);
  } catch (e) {
    console.error("List payment proofs error:", e);
    return NextResponse.json({ error: "Failed to list" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    await connectDB();
    const proof = await PaymentProof.create({
      userId,
      fileUrl: parsed.data.fileUrl,
      fileName: parsed.data.fileName,
      fileSize: parsed.data.fileSize,
      mimeType: parsed.data.mimeType,
      transactionId: parsed.data.transactionId,
      status: "pending",
    });
    return NextResponse.json(proof);
  } catch (e) {
    console.error("Create payment proof error:", e);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
