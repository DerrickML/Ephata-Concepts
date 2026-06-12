import { createHash } from "node:crypto";
import path from "node:path";
import { getDatabasePool } from "./database.js";
import { normalizeUploadRelativePath } from "./uploadUrls.js";

export async function putMediaAsset({ storageKey, mimeType, content, createdAt = new Date(), updatedAt = new Date() }) {
  const key = normalizeUploadRelativePath(storageKey);
  const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
  const folder = key.split("/")[0];
  const filename = path.posix.basename(key);
  const sha256 = createHash("sha256").update(buffer).digest("hex");
  await getDatabasePool().execute(
    `INSERT INTO media_assets
      (storage_key, folder, filename, mime_type, size_bytes, sha256, content, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE folder = VALUES(folder), filename = VALUES(filename),
       mime_type = VALUES(mime_type), size_bytes = VALUES(size_bytes), sha256 = VALUES(sha256),
       content = VALUES(content), updated_at = VALUES(updated_at)`,
    [key, folder, filename, mimeType, buffer.length, sha256, buffer, createdAt, updatedAt]
  );
  return { storageKey: key, mimeType, size: buffer.length, sha256 };
}

export async function getMediaAsset(storageKey) {
  const key = normalizeUploadRelativePath(storageKey);
  const [rows] = await getDatabasePool().execute(
    "SELECT storage_key, mime_type, size_bytes, sha256, content, updated_at FROM media_assets WHERE storage_key = ? LIMIT 1",
    [key]
  );
  if (!rows.length) return null;
  return {
    storageKey: rows[0].storage_key,
    mimeType: rows[0].mime_type,
    size: Number(rows[0].size_bytes),
    sha256: rows[0].sha256,
    content: rows[0].content,
    updatedAt: rows[0].updated_at
  };
}

export async function removeMediaAsset(storageKey) {
  const key = normalizeUploadRelativePath(storageKey);
  const [result] = await getDatabasePool().execute("DELETE FROM media_assets WHERE storage_key = ?", [key]);
  return result.affectedRows > 0;
}

export async function mediaAssetSummary() {
  const [rows] = await getDatabasePool().query(
    "SELECT COUNT(*) AS assetCount, COALESCE(SUM(size_bytes), 0) AS totalBytes FROM media_assets"
  );
  return { assetCount: Number(rows[0].assetCount), totalBytes: Number(rows[0].totalBytes) };
}
