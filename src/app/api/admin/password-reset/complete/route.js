import { NextResponse } from "next/server";
import { invalidOrigin, sameOrigin } from "@/lib/auth.js";
import { recordAudit } from "@/lib/audit.js";
import { getEmailRuntime } from "@/lib/emailService.js";
import { completePasswordReset } from "@/lib/passwordRecovery.js";

export const runtime = "nodejs";

export async function POST(request) {
  if (!sameOrigin(request)) return invalidOrigin();
  const runtime = await getEmailRuntime();
  if (!runtime.passwordResetAvailable) return NextResponse.json({ error: "Self-service password reset is not available. Contact an administrator." }, { status: 503 });
  try {
    const { login, otp, password, confirmPassword } = await request.json();
    if (!login || !otp || !password || password !== confirmPassword) return NextResponse.json({ error: "Enter the account, verification code, and matching passwords." }, { status: 422 });
    const user = await completePasswordReset(login, otp, password);
    await recordAudit({ actor: user, action: "password_reset_completed", section: "users", targetId: user.id, summary: "Completed self-service password reset" });
    return NextResponse.json({ message: "Password updated. You can now sign in." });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to reset the password." }, { status: 400 });
  }
}
