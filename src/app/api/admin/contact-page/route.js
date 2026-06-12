import { getPageContent, putPageContent } from "@/lib/adminApi.js";

export const runtime = "nodejs";

export function GET(request) {
  return getPageContent(request, "contactPage");
}

export function PUT(request) {
  return putPageContent(request, "contactPage");
}
