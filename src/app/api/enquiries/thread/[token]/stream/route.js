import { NextResponse } from "next/server";
import { getEnquiryByConversationToken } from "@/lib/enquiryThreads.js";
import { enquiryStreamResponse } from "@/lib/enquiryStream.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, context) {
  const { token } = await context.params;
  const enquiry = await getEnquiryByConversationToken(token);
  if (!enquiry) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  return enquiryStreamResponse(enquiry, request.signal);
}
