import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { hasPermission } from "./accessControl.js";
import { resolveSession } from "./userStore.js";

export const ADMIN_COOKIE_NAME = "ephata_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

export async function getAdminFromCookies() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  return (await resolveSession(token))?.user || null;
}

export async function requireAdminPage() {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function requirePermissionPage(section, action = "view") {
  const admin = await requireAdminPage();
  if (!hasPermission(admin, section, action)) redirect("/admin/forbidden");
  return admin;
}

export async function requireAdminRequest(request) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return (await resolveSession(token))?.user || null;
}

export async function authorizeRequest(request, section, action = "view") {
  const admin = await requireAdminRequest(request);
  if (!admin) return { ok: false, response: unauthorized() };
  if (!hasPermission(admin, section, action)) return { ok: false, response: forbidden() };
  return { ok: true, admin };
}

export async function authorizeAnyRequest(request, section, actions) {
  const admin = await requireAdminRequest(request);
  if (!admin) return { ok: false, response: unauthorized() };
  if (!actions.some((action) => hasPermission(admin, section, action))) {
    return { ok: false, response: forbidden() };
  }
  return { ok: true, admin };
}

export function sameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}

export function unauthorized() {
  return NextResponse.json({ error: "Authentication required" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "You do not have permission to perform this action." }, { status: 403 });
}

export function invalidOrigin() {
  return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
}

export function setAdminCookie(response, token) {
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  });
}

export function clearAdminCookie(response) {
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}
