import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Account, User } from "@/lib/models";
import { getUserIdFromRequest } from "@/lib/apiHelpers";
import { generateAccountNumber } from "@/lib/accountNumber";

const CreateSchema = z.object({
  accountType: z.enum(["savings", "current", "fixed", "domiciliary"]),
  currency: z.string().length(3).optional(),
  accountIcon: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const accounts = await Account.find({ userId }).populate("transactions", "date amount type status").lean();
    return NextResponse.json(accounts);
  } catch (e) {
    console.error("List accounts error:", e);
    return NextResponse.json({ error: "Failed to list accounts" }, { status: 500 });
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

    let accountNumber = await generateAccountNumber();
    let exists = await Account.findOne({ accountNumber });
    while (exists) {
      accountNumber = await generateAccountNumber();
      exists = await Account.findOne({ accountNumber });
    }

    const account = await Account.create({
      accountNumber,
      accountType: parsed.data.accountType,
      currency: parsed.data.currency ?? "USD",
      accountIcon: parsed.data.accountIcon ?? "wallet",
      userId,
    });
    await User.findByIdAndUpdate(userId, { $addToSet: { accounts: account._id } });

    return NextResponse.json(account);
  } catch (e) {
    console.error("Create account error:", e);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
