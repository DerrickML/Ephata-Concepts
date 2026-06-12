import { NextResponse } from "next/server";
import { authorizeRequest, invalidOrigin, sameOrigin } from "@/lib/auth.js";
import { recordAudit } from "@/lib/audit.js";
import { createAccessProfile } from "@/lib/userStore.js";
import { readCollection } from "@/lib/jsonStore.js";

export const runtime = "nodejs";

export async function GET(request) {
  const auth = await authorizeRequest(request, "users", "view");
  if (!auth.ok) return auth.response;
  return NextResponse.json({ profiles: await readCollection("accessProfiles") });
}

export async function POST(request) {
  if (!sameOrigin(request)) return invalidOrigin();
  const auth = await authorizeRequest(request, "users", "manage");
  if (!auth.ok) return auth.response;
  try {
    const input = await request.json();
    if (!input.name) return NextResponse.json({ error: "Profile name is required." }, { status: 422 });
    const profile = await createAccessProfile(input);
    await recordAudit({ actor: auth.admin, action: "create_profile", section: "users", targetId: profile.id, summary: `Created access profile ${profile.name}` });
    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to create access profile." }, { status: 400 });
  }
}
