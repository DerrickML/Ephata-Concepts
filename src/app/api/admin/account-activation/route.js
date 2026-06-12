import { NextResponse } from "next/server";
import { invalidOrigin, sameOrigin } from "@/lib/auth.js";
import { recordAudit } from "@/lib/audit.js";
import { acceptAccountInvitation, inspectAccountInvitation } from "@/lib/accountInvitations.js";
import { getResolvedUser } from "@/lib/userStore.js";

export const runtime = "nodejs";

export async function GET(request) {
  const token = new URL(request.url).searchParams.get("token");
  const invitation = await inspectAccountInvitation(token);
  if (!invitation) return NextResponse.json({ error: "This invitation is invalid or has expired." }, { status: 404 });
  const user = await getResolvedUser(invitation.userId);
  if (!user) return NextResponse.json({ error: "This account is no longer available." }, { status: 404 });
  return NextResponse.json({ account: { name: user.name, email: user.email }, expiresAt: invitation.expiresAt });
}

export async function POST(request) {
  if (!sameOrigin(request)) return invalidOrigin();
  try {
    const { token, password, confirmPassword } = await request.json();
    if (!token || !password || password !== confirmPassword) return NextResponse.json({ error: "Enter matching passwords to activate the account." }, { status: 422 });
    const user = await acceptAccountInvitation(token, password);
    await recordAudit({ actor: user, action: "account_activated", section: "users", targetId: user.id, summary: "Activated invited account" });
    return NextResponse.json({ message: "Account activated. You can now sign in." });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to activate the account." }, { status: 400 });
  }
}
