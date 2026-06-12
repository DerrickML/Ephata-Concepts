import { promises as fs } from "fs";
import path from "path";
import { IMAGE_MIME_TYPES, MAX_UPLOAD_BYTES, UPLOAD_FOLDERS } from "./constants.js";
import { slugify } from "./slugify.js";
import { normalizeUploadRelativePath, publicUploadUrl } from "./uploadUrls.js";

const DEFAULT_UPLOADS_ROOT = path.join(process.cwd(), "data", "storage", "uploads");

export function getUploadsRoot() {
  return DEFAULT_UPLOADS_ROOT;
}

export async function ensureUploadDirs() {
  const root = getUploadsRoot();
  await fs.mkdir(root, { recursive: true });
  await Promise.all(
    UPLOAD_FOLDERS.map((folder) => fs.mkdir(path.join(root, folder), { recursive: true }))
  );
  return root;
}

export function safeUploadPath(relativePath) {
  const root = getUploadsRoot();
  if (path.isAbsolute(String(relativePath || ""))) {
    throw new Error("Invalid upload path");
  }
  const normalized = normalizeUploadRelativePath(relativePath);
  const localParts = normalized.split("/");
  const rootWithSeparator = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
  const resolved = path.normalize(path.join(process.cwd(), "data", "storage", "uploads", ...localParts));
  if (!resolved.startsWith(rootWithSeparator)) {
    throw new Error("Unsafe upload path");
  }
  return resolved;
}

export { publicUploadUrl };

function extensionFor(file) {
  const typeExtension = IMAGE_MIME_TYPES[file.type];
  if (!typeExtension) {
    throw new Error("Unsupported image type");
  }
  if (file.type === "image/svg+xml") {
    return ".svg";
  }
  const ext = path.extname(file.name || "").toLowerCase();
  return Object.values(IMAGE_MIME_TYPES).includes(ext) ? ext : typeExtension;
}

export async function saveUploadedFile(file, folder) {
  if (!UPLOAD_FOLDERS.includes(folder)) {
    throw new Error("Unsupported upload folder");
  }
  if (!file || typeof file.arrayBuffer !== "function") {
    throw new Error("No file supplied");
  }
  if (!IMAGE_MIME_TYPES[file.type]) {
    throw new Error("Only JPEG, PNG, WebP, and trusted SVG images are allowed");
  }
  if (file.type === "image/svg+xml" && folder !== "brand") {
    throw new Error("SVG uploads are only allowed for trusted brand assets");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image must be 10 MB or smaller");
  }

  await ensureUploadDirs();
  const extension = extensionFor(file);
  const base = slugify(path.basename(file.name || "image", path.extname(file.name || ""))) || "image";
  const token = Math.random().toString(36).slice(2, 8);
  const filename = `${base}-${Date.now()}-${token}${extension}`;
  const relativePath = `${folder}/${filename}`;
  const target = safeUploadPath(relativePath);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(target, buffer);
  return relativePath;
}

export async function deleteUploadedFile(relativePath) {
  const target = safeUploadPath(relativePath);
  try {
    await fs.unlink(target);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

export function contentTypeForPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}
