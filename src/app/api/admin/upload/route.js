import { NextResponse } from "next/server";
import { deleteUploadedFile, saveUploadedFile } from "@/lib/uploads.js";
import { authorizeAnyRequest, invalidOrigin, sameOrigin } from "@/lib/auth.js";
import { recordAudit } from "@/lib/audit.js";

export const runtime = "nodejs";

export async function POST(request) {
  if (!sameOrigin(request)) return invalidOrigin();

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "temp");
    const section = folder === "brand" ? "settings" : folder === "blog" ? "insights" : folder === "temp" ? "portfolio" : folder;
    const auth = await authorizeAnyRequest(request, section, ["create", "edit"]);
    if (!auth.ok) return auth.response;
    const path = await saveUploadedFile(file, folder);
    await recordAudit({ actor: auth.admin, action: "upload", section, targetId: path, summary: `Uploaded media to ${folder}` });
    return NextResponse.json({ path, url: `/api/uploads/${path}` }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 400 });
  }
}

export async function DELETE(request) {
  if (!sameOrigin(request)) return invalidOrigin();

  try {
    const { path } = await request.json();
    const folder = String(path || "").split("/")[0];
    const section = folder === "brand" ? "settings" : folder === "blog" ? "insights" : folder === "temp" ? "portfolio" : folder;
    const auth = await authorizeAnyRequest(request, section, ["create", "edit"]);
    if (!auth.ok) return auth.response;
    const deleted = await deleteUploadedFile(path);
    if (deleted) await recordAudit({ actor: auth.admin, action: "delete_upload", section, targetId: path, summary: "Deleted uploaded media" });
    return NextResponse.json({ ok: true, deleted });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Delete failed" }, { status: 400 });
  }
}
