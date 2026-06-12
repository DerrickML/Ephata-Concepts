import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, clearAdminCookie, requireAdminRequest } from "@/lib/auth.js";
import { recordAudit } from "@/lib/audit.js";
import { revokeSession } from "@/lib/userStore.js";

export const runtime = "nodejs";

export async function POST(request) {
  const admin = await requireAdminRequest(request);
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  await revokeSession(token);
  if (admin) {
    await recordAudit({ actor: admin, action: "logout", section: "users", targetId: admin.id, summary: "Signed out" });
  }
  const response = NextResponse.json({ ok: true });
  clearAdminCookie(response);
  return response;
}
