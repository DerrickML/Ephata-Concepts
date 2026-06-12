import { NextResponse } from "next/server";
import { authorizeRequest, invalidOrigin, publicRequestOrigin, sameOrigin } from "@/lib/auth.js";
import { recordAudit } from "@/lib/audit.js";
import { getEmailRuntime } from "@/lib/emailService.js";
import { sendAccountInvitation } from "@/lib/notifications.js";
import { getResolvedUser } from "@/lib/userStore.js";

export const runtime = "nodejs";

export async function POST(request, context) {
  if (!sameOrigin(request)) return invalidOrigin();
  const auth = await authorizeRequest(request, "users", "edit");
  if (!auth.ok) return auth.response;
  const { id } = await context.params;
  const [user, runtime] = await Promise.all([getResolvedUser(id), getEmailRuntime()]);
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
  if (user.status !== "pending") return NextResponse.json({ error: "Only pending accounts can receive an activation invitation." }, { status: 422 });
  if (!runtime.accountInvitationsAvailable) return NextResponse.json({ error: "Verify SMTP and enable account invitations first." }, { status: 503 });
  const delivery = await sendAccountInvitation(user, publicRequestOrigin(request));
  await recordAudit({ actor: auth.admin, action: "resend_account_invitation", section: "users", targetId: user.id, summary: `Resent account invitation to ${user.name}` });
  return NextResponse.json({ deliveryStatus: delivery?.status || "pending" });
}
