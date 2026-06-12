import { NextResponse } from "next/server";
import { readUploadedFile } from "@/lib/uploads.js";

export const runtime = "nodejs";

export async function GET(_request, context) {
  const params = await context.params;
  const relativePath = (params.path || []).join("/");

  try {
    const file = await readUploadedFile(relativePath);
    if (!file) return NextResponse.json({ error: "Image not found" }, { status: 404 });
    return new NextResponse(file.content, {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Length": String(file.size),
        "ETag": `\"${file.sha256}\"`,
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
