import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/apiHelpers";

export async function GET(request: Request) {
  const userId = getUserIdFromRequest(request as unknown as import("next/server").NextRequest);
  if (!userId) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
  return NextResponse.json({ valid: true, userId });
}
