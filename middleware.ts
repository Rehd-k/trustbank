export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, getBearerToken, isSessionIdle, deleteSession, updateSessionActivity } from "./lib/auth";
import { connectDB } from "./lib/db";
import { User } from "./lib/models";

const publicPaths = [
  "/api/auth/signup",
  "/api/auth/login",
  "/api/auth/request-otp",
  "/api/auth/verify-otp",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/verify-email",
  "/api/uploadthing",
];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some((p) => pathname.startsWith(p));
}

function isAdminPath(pathname: string): boolean {
  return pathname.startsWith("/api/admin/");
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = getBearerToken(request.headers.get("authorization"));
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  try {
    await connectDB();
    const idle = await isSessionIdle(token);
    if (idle) {
      await deleteSession(token);
      return NextResponse.json({ error: "Session expired (idle logout)" }, { status: 401 });
    }
    await updateSessionActivity(token);

    if (isAdminPath(pathname)) {
      const user = await User.findById(payload.userId).select("role").lean();
      if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden: admin only" }, { status: 403 });
      }
    }
  } catch {
    // DB might be down; continue and let route handle it
  }

  const res = NextResponse.next();
  res.headers.set("x-user-id", payload.userId);
  res.headers.set("x-session-id", payload.sessionId);
  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};
