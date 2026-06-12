import { NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/auth.js";
import { readCollection } from "@/lib/jsonStore.js";

export const runtime = "nodejs";

export async function GET(request) {
  const auth = await authorizeRequest(request, "settings", "view");
  if (!auth.ok) return auth.response;
  const entries = await readCollection("emailOutbox");
  const items = entries.slice(-50).reverse().map(({ text, html, metadata, ...entry }) => entry);
  return NextResponse.json({ items });
}
