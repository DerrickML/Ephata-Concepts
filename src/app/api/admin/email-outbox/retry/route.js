import { NextResponse } from "next/server";
import { authorizeRequest, invalidOrigin, sameOrigin } from "@/lib/auth.js";
import { recordAudit } from "@/lib/audit.js";
import { retryEmailOutbox } from "@/lib/emailService.js";

export const runtime = "nodejs";

export async function POST(request) {
  if (!sameOrigin(request)) return invalidOrigin();
  const auth = await authorizeRequest(request, "settings", "edit");
  if (!auth.ok) return auth.response;
  const results = await retryEmailOutbox();
  await recordAudit({ actor: auth.admin, action: "retry_email_outbox", section: "settings", targetId: "email-outbox", summary: `Retried ${results.length} queued email${results.length === 1 ? "" : "s"}` });
  return NextResponse.json({ results });
}
