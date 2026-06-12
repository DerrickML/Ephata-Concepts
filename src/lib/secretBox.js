import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

function encryptionKey() {
  const secret = process.env.EMAIL_SECRETS_KEY;
  return secret ? createHash("sha256").update(secret).digest() : null;
}

export function emailEncryptionAvailable() {
  return Boolean(encryptionKey());
}

export function encryptEmailSecret(value) {
  const key = encryptionKey();
  if (!key) throw new Error("EMAIL_SECRETS_KEY must be configured before storing an SMTP password.");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  return ["v1", iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), encrypted.toString("base64url")].join(":");
}

export function decryptEmailSecret(payload) {
  if (!payload) return "";
  const key = encryptionKey();
  if (!key) return "";
  try {
    const [version, iv, tag, encrypted] = String(payload).split(":");
    if (version !== "v1" || !iv || !tag || !encrypted) return "";
    const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(iv, "base64url"));
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(encrypted, "base64url")), decipher.final()]).toString("utf8");
  } catch {
    return "";
  }
}
