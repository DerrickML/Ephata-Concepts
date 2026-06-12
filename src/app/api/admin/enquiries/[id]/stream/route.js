import { NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/auth.js";
import { enquiryStreamResponse } from "@/lib/enquiryStream.js";
import { readCollection } from "@/lib/jsonStore.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, context) {
  const auth = await authorizeRequest(request, "enquiries", "view");
  if (!auth.ok) return auth.response;
  const { id } = await context.params;
  const enquiries = await readCollection("enquiries");
  const enquiry = enquiries.find((entry) => entry.id === id);
  if (!enquiry) return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  return enquiryStreamResponse(enquiry, request.signal);
}
