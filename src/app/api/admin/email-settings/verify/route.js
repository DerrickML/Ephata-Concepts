import { NextResponse } from "next/server";
import { authorizeRequest, invalidOrigin, sameOrigin } from "@/lib/auth.js";
import { recordAudit } from "@/lib/audit.js";
import { verifyEmailSettings } from "@/lib/emailService.js";

export const runtime = "nodejs";

export async function POST(request) {
  if (!sameOrigin(request)) return invalidOrigin();
  const auth = await authorizeRequest(request, "settings", "edit");
  if (!auth.ok) return auth.response;
  try {
    const settings = await verifyEmailSettings();
    await recordAudit({ actor: auth.admin, action: "verify_smtp", section: "settings", targetId: "email-settings", summary: "Verified SMTP connection" });
    return NextResponse.json({ settings });
  } catch (error) {
    await recordAudit({ actor: auth.admin, action: "verify_smtp_failed", section: "settings", targetId: "email-settings", summary: "SMTP connection verification failed" });
    return NextResponse.json({ error: error.message || "SMTP verification failed." }, { status: 400 });
  }
}
