import { getSettings, putSettings } from "@/lib/adminApi.js";

export const runtime = "nodejs";

export function GET(request) {
  return getSettings(request);
}

export function PUT(request) {
  return putSettings(request);
}

