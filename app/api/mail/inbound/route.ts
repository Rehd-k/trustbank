import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Mail, User } from "@/lib/models";
import { getUserIdFromRequest } from "@/lib/apiHelpers";

const InboundSchema = z.object({
  to: z.string().email(),
  from: z.string().email(),
  subject: z.string(),
  body: z.string(),
});

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const parsed = InboundSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    await connectDB();
    const user = await User.findById(userId).select("email").lean();
    if (!user || user.email !== parsed.data.to) {
      return NextResponse.json({ error: "Can only add inbound mail for your own email" }, { status: 403 });
    }
    const mail = await Mail.create({
      userId,
      direction: "inbound",
      to: parsed.data.to,
      from: parsed.data.from,
      subject: parsed.data.subject,
      body: parsed.data.body,
    });
    return NextResponse.json(mail);
  } catch (e) {
    console.error("Add inbound mail error:", e);
    return NextResponse.json({ error: "Failed to add" }, { status: 500 });
  }
}
