import { NextResponse } from "next/server";
import { authorizeRequest, invalidOrigin, sameOrigin } from "@/lib/auth.js";
import { recordAudit } from "@/lib/audit.js";
import { deleteUserAccount, getResolvedUser, updateUserAccount } from "@/lib/userStore.js";
import { readCollection } from "@/lib/jsonStore.js";
import { canGrantPermissions, canManageUsers, resolvePermissions } from "@/lib/accessControl.js";

export const runtime = "nodejs";

export async function GET(request, context) {
  const auth = await authorizeRequest(request, "users", "view");
  if (!auth.ok) return auth.response;
  const { id } = await context.params;
  const user = await getResolvedUser(id);
  return user ? NextResponse.json({ user }) : NextResponse.json({ error: "User not found." }, { status: 404 });
}

export async function PUT(request, context) {
  if (!sameOrigin(request)) return invalidOrigin();
  const auth = await authorizeRequest(request, "users", "edit");
  if (!auth.ok) return auth.response;
  const { id } = await context.params;
  const current = await getResolvedUser(id);
  if (!current) return NextResponse.json({ error: "User not found." }, { status: 404 });
  try {
    const input = await request.json();
    if (current.isSystemOwner && auth.admin.id !== current.id) {
      return NextResponse.json({ error: "Only the system owner can update the owner account." }, { status: 403 });
    }
    const managesAccess = canManageUsers(auth.admin);
    if (id === auth.admin.id || current.isSystemOwner || !managesAccess) {
      delete input.status;
      delete input.accessProfileId;
      delete input.permissionOverrides;
    } else if (input.accessProfileId) {
      const profiles = await readCollection("accessProfiles");
      const profile = profiles.find((entry) => entry.id === input.accessProfileId);
      if (!profile) {
        return NextResponse.json({ error: "Select a valid access profile." }, { status: 422 });
      }
      const requested = resolvePermissions(profile.permissions, input.permissionOverrides || current.permissionOverrides);
      if (!canGrantPermissions(auth.admin, requested)) {
        return NextResponse.json({ error: "You cannot grant permissions that your own account does not possess." }, { status: 403 });
      }
    }
    const user = await updateUserAccount(id, input);
    await recordAudit({ actor: auth.admin, action: "edit_user", section: "users", targetId: id, summary: `Updated account for ${user.name}` });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to update user." }, { status: 400 });
  }
}

export async function DELETE(request, context) {
  if (!sameOrigin(request)) return invalidOrigin();
  const auth = await authorizeRequest(request, "users", "delete");
  if (!auth.ok) return auth.response;
  const { id } = await context.params;
  if (id === auth.admin.id) return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  try {
    const deleted = await deleteUserAccount(id);
    if (!deleted) return NextResponse.json({ error: "User not found." }, { status: 404 });
    await recordAudit({ actor: auth.admin, action: "delete_user", section: "users", targetId: id, summary: "Deleted user account" });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to delete user." }, { status: 400 });
  }
}
