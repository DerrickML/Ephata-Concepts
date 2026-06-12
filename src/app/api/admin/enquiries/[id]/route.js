import { deleteEnquiry, updateEnquiryStatus } from "@/lib/adminApi.js";

export const runtime = "nodejs";

export async function PUT(request, context) {
  const { id } = await context.params;
  return updateEnquiryStatus(request, id);
}

export async function DELETE(request, context) {
  const { id } = await context.params;
  return deleteEnquiry(request, id);
}

