import { NextResponse } from "next/server";
import { authorizeRequest, invalidOrigin, sameOrigin } from "@/lib/auth.js";
import { recordAudit } from "@/lib/audit.js";
import { getEmailSettingsView, saveEmailSettings } from "@/lib/emailService.js";

export const runtime = "nodejs";

export async function GET(request) {
  const auth = await authorizeRequest(request, "settings", "view");
  if (!auth.ok) return auth.response;
  return NextResponse.json({ settings: await getEmailSettingsView() });
}

export async function PUT(request) {
  if (!sameOrigin(request)) return invalidOrigin();
  const auth = await authorizeRequest(request, "settings", "edit");
  if (!auth.ok) return auth.response;
  try {
    const settings = await saveEmailSettings(await request.json());
    await recordAudit({ actor: auth.admin, action: "edit_email_settings", section: "settings", targetId: "email-settings", summary: "Updated email delivery settings" });
    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to save email settings." }, { status: 400 });
  }
}
