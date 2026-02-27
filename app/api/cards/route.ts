import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Card, Account, User } from "@/lib/models";
import { getUserIdFromRequest } from "@/lib/apiHelpers";
import { generateLastFourDigits } from "@/lib/accountNumber";

const CreateSchema = z.object({
  type: z.enum(["debit", "credit", "prepaid"]),
  accountId: z.string(),
});

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const cards = await Card.find({ userId }).populate("accountId", "accountNumber accountType").lean();
    return NextResponse.json(cards);
  } catch (e) {
    console.error("List cards error:", e);
    return NextResponse.json({ error: "Failed to list cards" }, { status: 500 });
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
    const account = await Account.findOne({ _id: parsed.data.accountId, userId });
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    const lastFourDigits = generateLastFourDigits();
    const card = await Card.create({
      type: parsed.data.type,
      accountId: account._id,
      userId,
      lastFourDigits,
      balance: parsed.data.type === "credit" ? 0 : account.accountBalance,
    });
    await User.findByIdAndUpdate(userId, { $addToSet: { cards: card._id } });
    return NextResponse.json(card);
  } catch (e) {
    console.error("Create card error:", e);
    return NextResponse.json({ error: "Failed to create card" }, { status: 500 });
  }
}
