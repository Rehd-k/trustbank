import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Card } from "@/lib/models";
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
    const card = await Card.findOne({ _id: id, userId }).populate("accountId").populate("transactions").lean();
    if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });
    return NextResponse.json(card);
  } catch (e) {
    console.error("Get card error:", e);
    return NextResponse.json({ error: "Failed to get card" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await connectDB();
    const card = await Card.findOne({ _id: id, userId });
    if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });
    await Card.findByIdAndDelete(id);
    return NextResponse.json({ message: "Card deleted" });
  } catch (e) {
    console.error("Delete card error:", e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
