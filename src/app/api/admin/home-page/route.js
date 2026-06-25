import { getPageContent, putPageContent } from "@/lib/adminApi.js";

export const runtime = "nodejs";

export function GET(request) {
  return getPageContent(request, "homePage");
}

export function PUT(request) {
  return putPageContent(request, "homePage");
}
