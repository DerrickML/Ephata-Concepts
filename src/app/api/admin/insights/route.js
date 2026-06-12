import { createCollectionItem, listCollection } from "@/lib/adminApi.js";

export const runtime = "nodejs";

export function GET(request) {
  return listCollection(request, "insights");
}

export function POST(request) {
  return createCollectionItem(request, "insights");
}

