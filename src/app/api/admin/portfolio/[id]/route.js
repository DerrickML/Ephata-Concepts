import { deleteCollectionItem, updateCollectionItem } from "@/lib/adminApi.js";

export const runtime = "nodejs";

export async function PUT(request, context) {
  const { id } = await context.params;
  return updateCollectionItem(request, "portfolio", id);
}

export async function DELETE(request, context) {
  const { id } = await context.params;
  return deleteCollectionItem(request, "portfolio", id);
}

