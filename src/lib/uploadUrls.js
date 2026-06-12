import { UPLOAD_FOLDERS } from "./constants.js";

export function isRemoteImageUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeUploadRelativePath(relativePath) {
  const value = String(relativePath || "").replace(/\\/g, "/").replace(/^\/+/, "");
  if (!value || value.includes("\0")) {
    throw new Error("Invalid upload path");
  }
  const parts = value.split("/").filter(Boolean);
  if (!parts.length || parts.some((part) => part === "." || part === "..")) {
    throw new Error("Invalid upload path");
  }
  if (!UPLOAD_FOLDERS.includes(parts[0])) {
    throw new Error("Unsupported upload folder");
  }
  return parts.join("/");
}

export function publicUploadUrl(relativePath) {
  if (!relativePath) {
    return "";
  }
  return `/api/uploads/${normalizeUploadRelativePath(relativePath)}`;
}

export function resolveImageSource(source) {
  const value = String(source || "").trim();
  if (!value) {
    return { src: "", remote: false };
  }

  if (isRemoteImageUrl(value)) {
    return { src: value, remote: true };
  }

  if (value.startsWith("/")) {
    return { src: value, remote: false };
  }

  try {
    return { src: publicUploadUrl(value), remote: false };
  } catch {
    return { src: "", remote: false };
  }
}
