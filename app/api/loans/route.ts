import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Loan, Account } from "@/lib/models";
import { getUserIdFromRequest } from "@/lib/apiHelpers";

const CreateSchema = z.object({
  accountId: z.string(),
  amount: z.number().positive(),
  interestRate: z.number().min(0),
  termMonths: z.number().int().min(1),
  currency: z.string().length(3).optional(),
});

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const loans = await Loan.find({ userId }).populate("accountId", "accountNumber accountType").lean();
    return NextResponse.json(loans);
  } catch (e) {
    console.error("List loans error:", e);
    return NextResponse.json({ error: "Failed to list loans" }, { status: 500 });
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
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + parsed.data.termMonths);
    const loan = await Loan.create({
      userId,
      accountId: account._id,
      amount: parsed.data.amount,
      interestRate: parsed.data.interestRate,
      termMonths: parsed.data.termMonths,
      status: "pending",
      remainingBalance: 0,
      currency: parsed.data.currency ?? "USD",
      dueDate,
    });
    return NextResponse.json(loan);
  } catch (e) {
    console.error("Create loan error:", e);
    return NextResponse.json({ error: "Failed to create loan" }, { status: 500 });
  }
}
