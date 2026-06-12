import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import { contentTypeForPath, safeUploadPath } from "@/lib/uploads.js";

export const runtime = "nodejs";

export async function GET(_request, context) {
  const params = await context.params;
  const relativePath = (params.path || []).join("/");

  try {
    const filePath = safeUploadPath(relativePath);
    const file = await fs.readFile(/*turbopackIgnore: true*/ filePath);
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentTypeForPath(filePath),
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
