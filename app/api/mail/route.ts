import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Mail, User } from "@/lib/models";
import { sendMail } from "@/lib/email";
import { getUserIdFromRequest } from "@/lib/apiHelpers";

const SendSchema = z.object({
  to: z.email(),
  subject: z.string().min(1),
  body: z.string(),
});

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const direction = request.nextUrl.searchParams.get("direction") as "inbound" | "outbound" | null;
  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit")) || 50, 100);
  try {
    await connectDB();
    const filter = { userId };
    if (direction === "inbound" || direction === "outbound") {
      (filter as Record<string, string>).direction = direction;
    }
    const mails = await Mail.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
    return NextResponse.json(mails);
  } catch (e) {
    console.error("List mail error:", e);
    return NextResponse.json({ error: "Failed to list mail" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const parsed = SendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    await connectDB();
    const user = await User.findById(userId).select("email").lean();
    const fromEmail = user?.email ?? "noreply@bank.com";
    const sent = await sendMail(
      parsed.data.to,
      parsed.data.subject,
      `<p>${parsed.data.body.replace(/\n/g, "<br>")}</p>`,
      parsed.data.body
    );
    if (!sent) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
    }
    const mail = await Mail.create({
      userId,
      direction: "outbound",
      from: fromEmail,
      to: parsed.data.to,
      subject: parsed.data.subject,
      body: parsed.data.body,
    });
    return NextResponse.json(mail);
  } catch (e) {
    console.error("Send mail error:", e);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
