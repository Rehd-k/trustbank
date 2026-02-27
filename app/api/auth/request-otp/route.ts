import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User, Otp } from "@/lib/models";
import { generateOtp, getOtpExpiry } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";

const BodySchema = z.object({
  email: z.email(),
  purpose: z.enum(["login", "forgot_password"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { email, purpose } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    await connectDB();

    if (purpose === "login") {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return NextResponse.json({ error: "No account with this email" }, { status: 404 });
      }
    } else {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return NextResponse.json({ error: "No account with this email" }, { status: 404 });
      }
    }

    const code = generateOtp();
    const expiresAt = getOtpExpiry();
    await Otp.findOneAndUpdate(
      { email: normalizedEmail, purpose },
      { code, expiresAt, used: false },
      { upsert: true, new: true }
    );

    // const sent = await sendOtpEmail(normalizedEmail, code, purpose);
    // if (!sent) {
    //   return NextResponse.json({ error: "Failed to send OTP email" }, { status: 502 });
    // }

    return NextResponse.json({ message: "OTP sent to your email" });
  } catch (e) {
    console.error("Request OTP error:", e);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
