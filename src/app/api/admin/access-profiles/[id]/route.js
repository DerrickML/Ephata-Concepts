import { NextResponse } from "next/server";
import { authorizeRequest, invalidOrigin, sameOrigin } from "@/lib/auth.js";
import { recordAudit } from "@/lib/audit.js";
import { deleteAccessProfile, updateAccessProfile } from "@/lib/userStore.js";

export const runtime = "nodejs";

export async function PUT(request, context) {
  if (!sameOrigin(request)) return invalidOrigin();
  const auth = await authorizeRequest(request, "users", "manage");
  if (!auth.ok) return auth.response;
  const { id } = await context.params;
  try {
    const profile = await updateAccessProfile(id, await request.json());
    if (!profile) return NextResponse.json({ error: "Access profile not found." }, { status: 404 });
    await recordAudit({ actor: auth.admin, action: "edit_profile", section: "users", targetId: id, summary: `Updated access profile ${profile.name}` });
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to update access profile." }, { status: 400 });
  }
}

export async function DELETE(request, context) {
  if (!sameOrigin(request)) return invalidOrigin();
  const auth = await authorizeRequest(request, "users", "manage");
  if (!auth.ok) return auth.response;
  const { id } = await context.params;
  try {
    const deleted = await deleteAccessProfile(id);
    if (!deleted) return NextResponse.json({ error: "Access profile not found." }, { status: 404 });
    await recordAudit({ actor: auth.admin, action: "delete_profile", section: "users", targetId: id, summary: "Deleted access profile" });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to delete access profile." }, { status: 400 });
  }
}
