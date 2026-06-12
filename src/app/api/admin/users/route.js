import { NextResponse } from "next/server";
import { authorizeRequest, invalidOrigin, sameOrigin } from "@/lib/auth.js";
import { recordAudit } from "@/lib/audit.js";
import { createUserAccount, listPublicUsers } from "@/lib/userStore.js";
import { readCollection } from "@/lib/jsonStore.js";
import { canGrantPermissions, canManageUsers, resolvePermissions } from "@/lib/accessControl.js";
import { randomBytes } from "crypto";
import { getEmailRuntime } from "@/lib/emailService.js";
import { sendAccountCreatedNotice, sendAccountInvitation } from "@/lib/notifications.js";

export const runtime = "nodejs";

export async function GET(request) {
  const auth = await authorizeRequest(request, "users", "view");
  if (!auth.ok) return auth.response;
  const [users, profiles] = await Promise.all([listPublicUsers(), readCollection("accessProfiles")]);
  return NextResponse.json({ users, profiles });
}

export async function POST(request) {
  if (!sameOrigin(request)) return invalidOrigin();
  const auth = await authorizeRequest(request, "users", "create");
  if (!auth.ok) return auth.response;
  try {
    const input = await request.json();
    const runtime = await getEmailRuntime();
    const sendInvitation = input.sendInvitation === true && runtime.accountInvitationsAvailable;
    if (!input.name || !input.username || !input.email || (!input.password && !sendInvitation) || !input.accessProfileId) {
      return NextResponse.json({ error: "Name, username, email, access profile, and either a temporary password or an enabled email invitation are required." }, { status: 422 });
    }
    const profiles = await readCollection("accessProfiles");
    const profile = profiles.find((entry) => entry.id === input.accessProfileId);
    if (!profile) {
      return NextResponse.json({ error: "Select a valid access profile." }, { status: 422 });
    }
    if (!canManageUsers(auth.admin) && Object.values(input.permissionOverrides || {}).some((entry) => entry?.allow?.length || entry?.deny?.length)) {
      return NextResponse.json({ error: "Managing account-specific permissions requires User Management access." }, { status: 403 });
    }
    const requested = resolvePermissions(profile.permissions, input.permissionOverrides);
    if (!canGrantPermissions(auth.admin, requested)) {
      return NextResponse.json({ error: "You cannot grant permissions that your own account does not possess." }, { status: 403 });
    }
    const user = await createUserAccount({
      ...input,
      password: sendInvitation ? randomBytes(32).toString("base64url") : input.password,
      status: sendInvitation ? "pending" : input.status,
      mustChangePassword: sendInvitation ? false : input.mustChangePassword
    });
    const invitation = sendInvitation
      ? await sendAccountInvitation(user, request.nextUrl.origin)
      : user.status === "active" ? await sendAccountCreatedNotice(user, request.nextUrl.origin) : null;
    await recordAudit({ actor: auth.admin, action: "create_user", section: "users", targetId: user.id, summary: `Created account for ${user.name}` });
    return NextResponse.json({ user, invitationStatus: invitation?.status || null }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to create user." }, { status: 400 });
  }
}
