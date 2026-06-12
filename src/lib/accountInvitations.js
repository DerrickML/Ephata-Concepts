import { createHash, randomBytes } from "crypto";
import { readCollection, writeCollection } from "./jsonStore.js";
import { setRecoveredPassword } from "./userStore.js";

const INVITATION_TTL_MS = 48 * 60 * 60 * 1000;

function tokenHash(token) {
  return createHash("sha256").update(String(token || "")).digest("hex");
}

export async function createAccountInvitation(userId) {
  const token = randomBytes(32).toString("base64url");
  const entries = await readCollection("accountInvitations");
  const now = Date.now();
  const active = entries.filter((entry) => entry.userId !== userId && !entry.usedAt && new Date(entry.expiresAt).getTime() > now);
  active.push({
    id: `invite_${randomBytes(10).toString("hex")}`,
    userId,
    tokenHash: tokenHash(token),
    attempts: 0,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + INVITATION_TTL_MS).toISOString(),
    usedAt: null
  });
  await writeCollection("accountInvitations", active);
  return token;
}

export async function inspectAccountInvitation(token) {
  const entries = await readCollection("accountInvitations");
  const entry = entries.find((candidate) => candidate.tokenHash === tokenHash(token));
  if (!entry || entry.usedAt || new Date(entry.expiresAt).getTime() <= Date.now()) return null;
  return entry;
}

export async function acceptAccountInvitation(token, password) {
  const entries = await readCollection("accountInvitations");
  const hash = tokenHash(token);
  const entry = entries.find((candidate) => candidate.tokenHash === hash);
  if (!entry || entry.usedAt || new Date(entry.expiresAt).getTime() <= Date.now()) {
    throw new Error("This account invitation is invalid or has expired.");
  }
  const user = await setRecoveredPassword(entry.userId, password, { activate: true });
  if (!user) throw new Error("The invited account no longer exists.");
  await writeCollection(
    "accountInvitations",
    entries.map((candidate) => candidate.id === entry.id ? { ...candidate, usedAt: new Date().toISOString() } : candidate)
  );
  return user;
}
