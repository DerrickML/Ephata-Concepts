import { NextResponse } from "next/server";
import { createItem } from "@/lib/jsonStore.js";
import { publicRequestOrigin } from "@/lib/auth.js";
import { validateEnquiry } from "@/lib/validators.js";
import { addEnquiryMessage } from "@/lib/enquiryThreads.js";
import { notifyEnquiryUsers } from "@/lib/notifications.js";

export const runtime = "nodejs";

export async function POST(request) {
  const input = await request.json();
  const validation = validateEnquiry(input);

  if (!validation.ok) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.errors },
      { status: 422 }
    );
  }

  const item = await createItem("enquiries", {
    ...validation.data,
    status: "new",
    messageCount: 0,
    lastMessageAt: new Date().toISOString()
  });

  await addEnquiryMessage({
    enquiryId: item.id,
    direction: "inbound",
    senderName: item.fullName,
    senderEmail: item.email,
    recipientEmail: "",
    body: item.message
  });
  await notifyEnquiryUsers({ enquiry: item, origin: publicRequestOrigin(request), event: "new" }).catch(() => []);

  return NextResponse.json(
    {
      message: "Thank you. Your enquiry has been received.",
      item: { id: item.id, createdAt: item.createdAt }
    },
    { status: 201 }
  );
}
