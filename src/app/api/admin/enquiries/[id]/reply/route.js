import { NextResponse } from "next/server";
import { authorizeRequest, invalidOrigin, publicRequestOrigin, sameOrigin } from "@/lib/auth.js";
import { recordAudit } from "@/lib/audit.js";
import { addEnquiryMessage, conversationTokenFor, updateEnquiryMessageDelivery } from "@/lib/enquiryThreads.js";
import { readCollection } from "@/lib/jsonStore.js";
import { sendEnquiryReply } from "@/lib/notifications.js";

export const runtime = "nodejs";

export async function POST(request, context) {
  if (!sameOrigin(request)) return invalidOrigin();
  const auth = await authorizeRequest(request, "enquiries", "edit");
  if (!auth.ok) return auth.response;
  const { id } = await context.params;
  const enquiries = await readCollection("enquiries");
  const enquiry = enquiries.find((entry) => entry.id === id);
  if (!enquiry) return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  const { body } = await request.json();
  const content = String(body || "").trim().slice(0, 10000);
  if (!content) return NextResponse.json({ error: "Write a reply before sending." }, { status: 422 });
  const message = await addEnquiryMessage({
    enquiryId: id,
    direction: "outbound",
    senderName: auth.admin.name,
    senderEmail: auth.admin.email,
    recipientEmail: enquiry.email,
    body: content,
    actorId: auth.admin.id,
    deliveryStatus: "pending"
  });
  const delivery = await sendEnquiryReply({ enquiry, message, conversationToken: conversationTokenFor(id), origin: publicRequestOrigin(request) });
  const updated = await updateEnquiryMessageDelivery(message.id, delivery?.status || "pending", delivery?.id || null);
  await recordAudit({ actor: auth.admin, action: "reply_enquiry", section: "enquiries", targetId: id, summary: `Replied to ${enquiry.fullName}` });
  return NextResponse.json({ message: updated, deliveryStatus: delivery?.status || "pending" }, { status: 201 });
}
