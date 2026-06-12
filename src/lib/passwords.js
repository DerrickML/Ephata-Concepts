import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export async function hashPassword(password, { allowLegacy = false } = {}) {
  const value = String(password || "");
  if (!allowLegacy && value.length < 10) {
    throw new Error("Password must be at least 10 characters.");
  }
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(value, salt, KEY_LENGTH);
  return `scrypt:${salt}:${Buffer.from(derived).toString("hex")}`;
}

export async function verifyPassword(password, storedHash) {
  const [algorithm, salt, hash] = String(storedHash || "").split(":");
  if (algorithm !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const derived = Buffer.from(await scrypt(String(password || ""), salt, expected.length));
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}
