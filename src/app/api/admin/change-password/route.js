import { NextResponse } from "next/server";
import { clearAdminCookie, invalidOrigin, requireAdminRequest, sameOrigin, setAdminCookie } from "@/lib/auth.js";
import { recordAudit } from "@/lib/audit.js";
import { changeOwnPassword, createSession } from "@/lib/userStore.js";

export const runtime = "nodejs";

export async function POST(request) {
  if (!sameOrigin(request)) return invalidOrigin();
  const admin = await requireAdminRequest(request);
  if (!admin) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  try {
    const { currentPassword, newPassword, confirmPassword } = await request.json();
    if (newPassword !== confirmPassword) return NextResponse.json({ error: "New passwords do not match." }, { status: 422 });
    const updated = await changeOwnPassword(admin.id, currentPassword, newPassword);
    const token = await createSession(updated.id);
    const response = NextResponse.json({ ok: true });
    clearAdminCookie(response);
    setAdminCookie(response, token);
    await recordAudit({ actor: updated, action: "change_password", section: "users", targetId: updated.id, summary: "Changed own password" });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to change password." }, { status: 400 });
  }
}
