import { NextResponse } from "next/server";
import { invalidOrigin, sameOrigin } from "@/lib/auth.js";
import { recordAudit } from "@/lib/audit.js";
import { getEmailRuntime } from "@/lib/emailService.js";
import { sendPasswordResetOtp } from "@/lib/notifications.js";
import { createPasswordResetChallenge } from "@/lib/passwordRecovery.js";

export const runtime = "nodejs";

export async function POST(request) {
  if (!sameOrigin(request)) return invalidOrigin();
  const runtime = await getEmailRuntime();
  if (!runtime.passwordResetAvailable) return NextResponse.json({ error: "Self-service password reset is not available. Contact an administrator." }, { status: 503 });
  const { login } = await request.json();
  const challenge = await createPasswordResetChallenge(login);
  if (challenge) await sendPasswordResetOtp(challenge.user, challenge.otp);
  await recordAudit({ action: "password_reset_requested", section: "users", summary: "Password reset requested" });
  return NextResponse.json({ message: "If an eligible account matches those details, a verification code has been sent." });
}
