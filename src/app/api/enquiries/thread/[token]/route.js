import { NextResponse } from "next/server";
import { publicRequestOrigin } from "@/lib/auth.js";
import { addEnquiryMessage, getEnquiryByConversationToken, getEnquiryMessages } from "@/lib/enquiryThreads.js";
import { notifyEnquiryUsers } from "@/lib/notifications.js";

export const runtime = "nodejs";

export async function GET(_request, context) {
  const { token } = await context.params;
  const enquiry = await getEnquiryByConversationToken(token);
  if (!enquiry) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  const messages = await getEnquiryMessages(enquiry.id);
  return NextResponse.json({ enquiry: { id: enquiry.id, fullName: enquiry.fullName, serviceInterest: enquiry.serviceInterest, status: enquiry.status }, messages });
}

export async function POST(request, context) {
  const { token } = await context.params;
  const enquiry = await getEnquiryByConversationToken(token);
  if (!enquiry) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  const { body } = await request.json();
  const content = String(body || "").trim().slice(0, 10000);
  if (!content) return NextResponse.json({ error: "Write a message before sending." }, { status: 422 });
  const recentMessages = await getEnquiryMessages(enquiry.id);
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const recentInboundCount = recentMessages.filter(
    (message) => message.direction === "inbound" && new Date(message.createdAt).getTime() > oneHourAgo
  ).length;
  if (recentInboundCount >= 10) return NextResponse.json({ error: "Too many replies were submitted. Please try again later." }, { status: 429 });
  const message = await addEnquiryMessage({ enquiryId: enquiry.id, direction: "inbound", senderName: enquiry.fullName, senderEmail: enquiry.email, recipientEmail: "", body: content });
  await notifyEnquiryUsers({ enquiry, origin: publicRequestOrigin(request), event: "reply" }).catch(() => []);
  return NextResponse.json({ message }, { status: 201 });
}
