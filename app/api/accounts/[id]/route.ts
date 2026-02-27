import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Account, User } from "@/lib/models";
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
    const account = await Account.findOne({ _id: id, userId })
      .populate("transactions")
      .populate('users', "lastname fristname")
      .lean();
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });
    return NextResponse.json(account);
  } catch (e) {
    console.error("Get account error:", e);
    return NextResponse.json({ error: "Failed to get account" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await request.json();
    const allowed = ["accountIcon", "currency"];
    const update: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }
    await connectDB();
    const account = await Account.findOneAndUpdate(
      { _id: id, userId },
      { $set: update },
      { returnDocument: 'after' }
    ).lean();
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });
    return NextResponse.json(account);
  } catch (e) {
    console.error("Update account error:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
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
    const account = await Account.findOne({ _id: id, userId });
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });
    if (account.accountBalance !== 0) {
      return NextResponse.json({ error: "Cannot delete account with non-zero balance" }, { status: 400 });
    }
    await Account.findByIdAndDelete(id);
    await User.findByIdAndUpdate(userId, { $pull: { accounts: id } });
    return NextResponse.json({ message: "Account deleted" });
  } catch (e) {
    console.error("Delete account error:", e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
