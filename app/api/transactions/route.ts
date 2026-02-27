import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Transaction, Account } from "@/lib/models";
import { getUserIdFromRequest } from "@/lib/apiHelpers";

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const accountNumber = request.nextUrl.searchParams.get("accountNumber");
  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit")) || 50, 100);
  try {
    await connectDB();
    const userAccountNumbers = (await Account.find({ userId }).select("accountNumber").lean()).map(
      (a) => a.accountNumber
    );
    type OrFilter = { fromAccount: string } | { toAccount: string } | { fromAccount: { $in: string[] } } | { toAccount: { $in: string[] } };
    const filter: { $or?: OrFilter[] } = {
      $or: [
        { fromAccount: { $in: userAccountNumbers } },
        { toAccount: { $in: userAccountNumbers } },
      ],
    };
    if (accountNumber) {
      if (!userAccountNumbers.includes(accountNumber)) {
        return NextResponse.json({ error: "Account not found" }, { status: 404 });
      }
      filter.$or = [{ fromAccount: accountNumber }, { toAccount: accountNumber }];
    }
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .limit(limit)
      .lean();
    return NextResponse.json(transactions);
  } catch (e) {
    console.error("List transactions error:", e);
    return NextResponse.json({ error: "Failed to list transactions" }, { status: 500 });
  }
}
