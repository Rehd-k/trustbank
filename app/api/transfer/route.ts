import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Account, Transaction, User } from "@/lib/models";
import { getUserIdFromRequest } from "@/lib/apiHelpers";

const LocalTransferSchema = z.object({
  fromAccountNumber: z.string(),
  toAccountNumber: z.string(),
  amount: z.number().positive(),
  description: z.string().optional(),
  kind: z.enum(["internal", "external"]).optional(),
});

const InternationalTransferSchema = z.object({
  fromAccountNumber: z.string(),
  toAccountNumber: z.string(),
  toAccountCurrency: z.string().length(3),
  amount: z.number().positive(),
  description: z.string().optional(),
  kind: z.enum(["internal", "external"]).optional(),
});

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const type = body.type as "local" | "international" | undefined;
    const kind = body.kind as "internal" | "external" | undefined;
    const schema = type === "international" ? InternationalTransferSchema : LocalTransferSchema;
    const parsed = schema.safeParse(
      type === "international"
        ? {
          fromAccountNumber: body.fromAccountNumber,
          toAccountNumber: body.toAccountNumber,
          toAccountCurrency: body.toAccountCurrency,
          amount: body.amount,
          description: body.description,
          kind
        }
        : {
          fromAccountNumber: body.fromAccountNumber,
          toAccountNumber: body.toAccountNumber,
          amount: body.amount,
          description: body.description,
          kind
        }
    );
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const transferKind: "internal" | "external" =
      data.kind ?? (type === "international" ? "external" : "internal");

    await connectDB();

    const user = await User.findById(userId).select("isBlocked transfersDisabled").lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.isBlocked) return NextResponse.json({ error: "Account is blocked" }, { status: 403 });
    if (user.transfersDisabled) return NextResponse.json({ error: "Transfers are disabled for your account" }, { status: 403 });

    const fromAccount = await Account.findOne({
      accountNumber: data.fromAccountNumber,
      userId,
    });


    if (!fromAccount) {
      return NextResponse.json({ error: "From account not found" }, { status: 404 });
    }
    if (fromAccount.accountBalance < data.amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }
    let toAccount: any
    if (transferKind === "internal") {
      toAccount = await Account.findOne({ accountNumber: data.toAccountNumber });
      if (!toAccount) {
        return NextResponse.json({ error: "To account not found" }, { status: 404 });
      }
    }

    try {
      const tx = await Transaction.create(
        [
          {
            date: new Date(),
            fromAccount: fromAccount.accountNumber,
            toAccount: transferKind === "internal" ? toAccount.accountNumber : data.toAccountNumber,
            amount: data.amount,
            currency: fromAccount.currency,
            type: type === "international" ? "international" : "local",
            status: "completed",
            description: data.description,
          },
        ],
      );
      const t = tx[0];
      await Account.findByIdAndUpdate(
        fromAccount._id,
        {
          $inc: { accountBalance: -data.amount },
          $push: { transactions: t._id },
        },
      );
      if (transferKind === "internal")
        await Account.findByIdAndUpdate(
          toAccount._id,
          {
            $inc: { accountBalance: data.amount },
            $push: { transactions: t._id },
          },
        );

      return NextResponse.json(t);
    } catch (e) {
      throw e;
    }
    // finally {
    //   session.endSession();
    // }
  } catch (e) {
    console.error("Transfer error:", e);
    return NextResponse.json({ error: "Transfer failed" }, { status: 500 });
  }
}


export async function GET(request: NextRequest) {
  return NextResponse.json({
    Here: 'for real'
  });
}