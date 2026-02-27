import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { sendVerificationEmail } from "@/lib/email";

function generateSecureToken(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 32; i++) array[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

const SignupSchema = z.object({
  firstname: z.string().min(1).max(100),
  lastname: z.string().min(1).max(100),
  email: z.email(),
  password: z.string().min(6).max(100),
  address: z.string().optional(),
  securityQuestions: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .max(5)
    .optional(),
  currency: z.string().length(3).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = SignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { firstname, lastname, email, password, address, securityQuestions, currency } = parsed.data;

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const emailVerificationToken = generateSecureToken();
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: hashedPassword,
      address: address ?? "",
      securityQuestions: securityQuestions ?? [],
      currency: currency ?? "USD",
      emailVerificationToken,
    });

    await sendVerificationEmail(email, emailVerificationToken);

    return NextResponse.json({
      message: "Signup successful. Please check your email to verify your account.",
      userId: user._id.toString(),
    });
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
