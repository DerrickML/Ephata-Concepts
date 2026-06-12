import { createCollectionItem, listCollection } from "@/lib/adminApi.js";
export const runtime = "nodejs";
export function GET(request) { return listCollection(request, "packageCategories"); }
export function POST(request) { return createCollectionItem(request, "packageCategories"); }
