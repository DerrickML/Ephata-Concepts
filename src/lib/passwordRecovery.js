import { createHash, randomBytes, randomInt, timingSafeEqual } from "crypto";
import { readCollection, writeCollection } from "./jsonStore.js";
import { findUserByLogin, setRecoveredPassword } from "./userStore.js";

const OTP_TTL_MS = 10 * 60 * 1000;
const REQUEST_WINDOW_MS = 30 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 3;
const MAX_ATTEMPTS = 5;

function otpHash(salt, otp) {
  return createHash("sha256").update(`${salt}:${String(otp || "")}`).digest("hex");
}

function safeEqual(left, right) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createPasswordResetChallenge(login) {
  const user = await findUserByLogin(login);
  if (!user || user.status !== "active" || !user.email || user.email.endsWith(".invalid")) return null;
  const entries = await readCollection("passwordResetChallenges");
  const now = Date.now();
  const recentRequests = entries.filter(
    (entry) => entry.userId === user.id && new Date(entry.createdAt).getTime() > now - REQUEST_WINDOW_MS
  );
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) return null;
  const otp = String(randomInt(100000, 1000000));
  const salt = randomBytes(16).toString("hex");
  const active = entries.filter((entry) => entry.userId !== user.id && !entry.usedAt && new Date(entry.expiresAt).getTime() > now);
  active.push({
    id: `reset_${randomBytes(10).toString("hex")}`,
    userId: user.id,
    login: String(login || "").trim().toLowerCase(),
    salt,
    otpHash: otpHash(salt, otp),
    attempts: 0,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + OTP_TTL_MS).toISOString(),
    usedAt: null
  });
  await writeCollection("passwordResetChallenges", active);
  return { user, otp };
}

export async function completePasswordReset(login, otp, newPassword) {
  const user = await findUserByLogin(login);
  if (!user) throw new Error("The code is invalid or has expired.");
  const entries = await readCollection("passwordResetChallenges");
  const entry = entries
    .filter((candidate) => candidate.userId === user.id && !candidate.usedAt)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0];
  if (!entry || new Date(entry.expiresAt).getTime() <= Date.now() || entry.attempts >= MAX_ATTEMPTS) {
    throw new Error("The code is invalid or has expired.");
  }
  const valid = safeEqual(entry.otpHash, otpHash(entry.salt, otp));
  if (!valid) {
    await writeCollection(
      "passwordResetChallenges",
      entries.map((candidate) => candidate.id === entry.id ? { ...candidate, attempts: candidate.attempts + 1 } : candidate)
    );
    throw new Error("The code is invalid or has expired.");
  }
  const updated = await setRecoveredPassword(user.id, newPassword);
  await writeCollection(
    "passwordResetChallenges",
    entries.map((candidate) => candidate.id === entry.id ? { ...candidate, usedAt: new Date().toISOString() } : candidate)
  );
  return updated;
}
