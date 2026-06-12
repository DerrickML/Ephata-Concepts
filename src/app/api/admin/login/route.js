import { NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/auth.js";
import { recordAudit } from "@/lib/audit.js";
import { authenticateUser, createSession } from "@/lib/userStore.js";

export const runtime = "nodejs";

export async function POST(request) {
  const { username, password } = await request.json();
  const result = await authenticateUser(username, password);
  if (!result.user) {
    await recordAudit({
      action: "login_failed",
      section: "users",
      summary: `Failed sign-in attempt for ${String(username || "unknown")}`
    });
    const message = result.reason === "locked"
      ? "Account temporarily locked after repeated failed attempts. Try again in 15 minutes."
      : "Invalid username or password";
    return NextResponse.json({ error: message }, { status: 401 });
  }

  const token = await createSession(result.user.id);
  const response = NextResponse.json({ ok: true, mustChangePassword: result.user.mustChangePassword });
  setAdminCookie(response, token);
  await recordAudit({ actor: result.user, action: "login", section: "users", targetId: result.user.id, summary: "Signed in" });
  return response;
}
