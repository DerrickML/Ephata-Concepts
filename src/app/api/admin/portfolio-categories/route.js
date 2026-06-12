import { createCollectionItem, listCollection } from "@/lib/adminApi.js";
export const runtime = "nodejs";
export function GET(request) { return listCollection(request, "portfolioCategories"); }
export function POST(request) { return createCollectionItem(request, "portfolioCategories"); }
