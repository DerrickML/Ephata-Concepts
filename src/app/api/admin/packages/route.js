import { createCollectionItem, listCollection } from "@/lib/adminApi.js";

export const runtime = "nodejs";

export function GET(request) {
  return listCollection(request, "packages");
}

export function POST(request) {
  return createCollectionItem(request, "packages");
}

