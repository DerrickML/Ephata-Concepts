import { NextResponse } from "next/server";
import { getEmailRuntime } from "@/lib/emailService.js";

export const runtime = "nodejs";

export async function GET() {
  const runtime = await getEmailRuntime();
  return NextResponse.json({ enabled: runtime.passwordResetAvailable });
}
