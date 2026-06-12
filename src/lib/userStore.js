import { createHash, randomBytes } from "crypto";
import { fullPermissions, resolvePermissions, sanitizeOverrides, sanitizePermissions } from "./accessControl.js";
import { hashPassword, verifyPassword } from "./passwords.js";
import { readCollection, writeCollection } from "./jsonStore.js";

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function normalizeLogin(value) {
  return String(value || "").trim().toLowerCase();
}

function tokenHash(token) {
  return createHash("sha256").update(token).digest("hex");
}

function publicUser(user, profile, permissions) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    jobTitle: user.jobTitle || "",
    status: user.status,
    accessProfileId: user.accessProfileId,
    accessProfileName: profile?.name || "Unassigned",
    permissions,
    permissionOverrides: sanitizeOverrides(user.permissionOverrides),
    isSystemOwner: Boolean(user.isSystemOwner),
    mustChangePassword: Boolean(user.mustChangePassword),
    notifyOnEnquiries: user.notifyOnEnquiries !== false,
    lastLoginAt: user.lastLoginAt || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export async function ensureIdentityBootstrap() {
  let profiles = await readCollection("accessProfiles");
  let users = await readCollection("users");
  const now = new Date().toISOString();
  let systemProfile = profiles.find((profile) => profile.isSystem);

  if (!systemProfile) {
    systemProfile = {
      id: "system-administrators",
      name: "System Administrators",
      description: "Unrestricted access to every administration section.",
      isSystem: true,
      permissions: fullPermissions(),
      createdAt: now,
      updatedAt: now
    };
    profiles = [...profiles, systemProfile];
    await writeCollection("accessProfiles", profiles);
  }

  if (!users.length) {
    const username = normalizeLogin(process.env.ADMIN_USERNAME || "admin");
    const password = process.env.ADMIN_PASSWORD || "change-me-now";
    const owner = {
      id: "system-owner",
      name: "System Administrator",
      email: `${username}@local.invalid`,
      username,
      jobTitle: "System Owner",
      status: "active",
      accessProfileId: systemProfile.id,
      permissionOverrides: {},
      passwordHash: await hashPassword(password, { allowLegacy: true }),
      mustChangePassword: password === "change-me-now",
      isSystemOwner: true,
      failedLoginCount: 0,
      lockedUntil: null,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now
    };
    users = [owner];
    await writeCollection("users", users);
  }

  return { profiles, users };
}

export async function getResolvedUser(userId) {
  const { profiles, users } = await ensureIdentityBootstrap();
  const user = users.find((entry) => entry.id === userId);
  if (!user) return null;
  const profile = profiles.find((entry) => entry.id === user.accessProfileId);
  const permissions = resolvePermissions(profile?.permissions, user.permissionOverrides);
  return publicUser(user, profile, permissions);
}

export async function authenticateUser(login, password) {
  const { profiles, users } = await ensureIdentityBootstrap();
  const normalized = normalizeLogin(login);
  const user = users.find(
    (entry) => normalizeLogin(entry.username) === normalized || normalizeLogin(entry.email) === normalized
  );
  if (!user || user.status !== "active") return { user: null, reason: "invalid" };

  if (user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()) {
    return { user: null, reason: "locked" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    const failedLoginCount = (user.failedLoginCount || 0) + 1;
    const lockedUntil = failedLoginCount >= 5 ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null;
    await writeCollection(
      "users",
      users.map((entry) => entry.id === user.id
        ? { ...entry, failedLoginCount: lockedUntil ? 0 : failedLoginCount, lockedUntil, updatedAt: new Date().toISOString() }
        : entry)
    );
    return { user: null, reason: lockedUntil ? "locked" : "invalid" };
  }

  const updated = {
    ...user,
    failedLoginCount: 0,
    lockedUntil: null,
    lastLoginAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  await writeCollection("users", users.map((entry) => entry.id === user.id ? updated : entry));
  const profile = profiles.find((entry) => entry.id === updated.accessProfileId);
  return { user: publicUser(updated, profile, resolvePermissions(profile?.permissions, updated.permissionOverrides)) };
}

export async function createSession(userId) {
  const token = randomBytes(32).toString("base64url");
  const sessions = await readCollection("sessions");
  const now = Date.now();
  const active = sessions.filter((session) => new Date(session.expiresAt).getTime() > now);
  active.push({
    id: `session_${randomBytes(10).toString("hex")}`,
    tokenHash: tokenHash(token),
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_TTL_MS).toISOString()
  });
  await writeCollection("sessions", active);
  return token;
}

export async function resolveSession(token) {
  if (!token) return null;
  const sessions = await readCollection("sessions");
  const now = Date.now();
  const session = sessions.find(
    (entry) => entry.tokenHash === tokenHash(token) && new Date(entry.expiresAt).getTime() > now
  );
  if (!session) return null;
  const user = await getResolvedUser(session.userId);
  return user?.status === "active" ? { session, user } : null;
}

export async function revokeSession(token) {
  if (!token) return;
  const hash = tokenHash(token);
  const sessions = await readCollection("sessions");
  await writeCollection("sessions", sessions.filter((session) => session.tokenHash !== hash));
}

export async function revokeUserSessions(userId) {
  const sessions = await readCollection("sessions");
  await writeCollection("sessions", sessions.filter((session) => session.userId !== userId));
}

export async function createUserAccount(input) {
  const { users } = await ensureIdentityBootstrap();
  const username = normalizeLogin(input.username);
  const email = normalizeLogin(input.email);
  if (users.some((user) => normalizeLogin(user.username) === username)) throw new Error("Username is already in use.");
  if (users.some((user) => normalizeLogin(user.email) === email)) throw new Error("Email is already in use.");
  const now = new Date().toISOString();
  const user = {
    id: `user_${randomBytes(10).toString("hex")}`,
    name: String(input.name || "").trim(),
    email,
    username,
    jobTitle: String(input.jobTitle || "").trim(),
    status: input.status === "pending" ? "pending" : "active",
    accessProfileId: String(input.accessProfileId || ""),
    permissionOverrides: sanitizeOverrides(input.permissionOverrides),
    passwordHash: await hashPassword(input.password),
    mustChangePassword: input.mustChangePassword !== false,
    notifyOnEnquiries: input.notifyOnEnquiries !== false,
    isSystemOwner: false,
    failedLoginCount: 0,
    lockedUntil: null,
    lastLoginAt: null,
    createdAt: now,
    updatedAt: now
  };
  await writeCollection("users", [...users, user]);
  return getResolvedUser(user.id);
}

export async function updateUserAccount(id, input) {
  const { users } = await ensureIdentityBootstrap();
  const current = users.find((user) => user.id === id);
  if (!current) return null;
  const username = normalizeLogin(input.username ?? current.username);
  const email = normalizeLogin(input.email ?? current.email);
  if (users.some((user) => user.id !== id && normalizeLogin(user.username) === username)) throw new Error("Username is already in use.");
  if (users.some((user) => user.id !== id && normalizeLogin(user.email) === email)) throw new Error("Email is already in use.");
  const updated = {
    ...current,
    name: String(input.name ?? current.name).trim(),
    email,
    username,
    jobTitle: String(input.jobTitle ?? current.jobTitle ?? "").trim(),
    status: ["active", "pending", "suspended", "deactivated"].includes(input.status) ? input.status : current.status,
    accessProfileId: String(input.accessProfileId ?? current.accessProfileId),
    permissionOverrides: input.permissionOverrides ? sanitizeOverrides(input.permissionOverrides) : current.permissionOverrides,
    mustChangePassword: typeof input.mustChangePassword === "boolean" ? input.mustChangePassword : current.mustChangePassword,
    notifyOnEnquiries: typeof input.notifyOnEnquiries === "boolean" ? input.notifyOnEnquiries : current.notifyOnEnquiries !== false,
    updatedAt: new Date().toISOString()
  };
  if (input.password) updated.passwordHash = await hashPassword(input.password);
  await writeCollection("users", users.map((user) => user.id === id ? updated : user));
  if (updated.status !== "active" || input.password) await revokeUserSessions(id);
  return getResolvedUser(id);
}

export async function listPublicUsers() {
  const { users } = await ensureIdentityBootstrap();
  return Promise.all(users.map((user) => getResolvedUser(user.id)));
}

export async function deleteUserAccount(id) {
  const { users } = await ensureIdentityBootstrap();
  const target = users.find((user) => user.id === id);
  if (!target) return false;
  if (target.isSystemOwner) throw new Error("The system owner cannot be deleted.");
  if (!["pending", "deactivated"].includes(target.status)) {
    throw new Error("Only pending or deactivated accounts can be deleted.");
  }
  await writeCollection("users", users.filter((user) => user.id !== id));
  await revokeUserSessions(id);
  return true;
}

export async function changeOwnPassword(userId, currentPassword, newPassword) {
  const { users } = await ensureIdentityBootstrap();
  const user = users.find((entry) => entry.id === userId);
  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    throw new Error("Current password is incorrect.");
  }
  const passwordHash = await hashPassword(newPassword);
  const updated = { ...user, passwordHash, mustChangePassword: false, updatedAt: new Date().toISOString() };
  await writeCollection("users", users.map((entry) => entry.id === userId ? updated : entry));
  await revokeUserSessions(userId);
  return getResolvedUser(userId);
}

export async function findUserByLogin(login) {
  const { users } = await ensureIdentityBootstrap();
  const normalized = normalizeLogin(login);
  return users.find(
    (entry) => normalizeLogin(entry.username) === normalized || normalizeLogin(entry.email) === normalized
  ) || null;
}

export async function setRecoveredPassword(userId, newPassword, { activate = false } = {}) {
  const { users } = await ensureIdentityBootstrap();
  const user = users.find((entry) => entry.id === userId);
  if (!user) return null;
  const updated = {
    ...user,
    passwordHash: await hashPassword(newPassword),
    status: activate ? "active" : user.status,
    mustChangePassword: false,
    failedLoginCount: 0,
    lockedUntil: null,
    updatedAt: new Date().toISOString()
  };
  await writeCollection("users", users.map((entry) => entry.id === userId ? updated : entry));
  await revokeUserSessions(userId);
  return getResolvedUser(userId);
}

export async function createAccessProfile(input) {
  const profiles = await readCollection("accessProfiles");
  const name = String(input.name || "").trim();
  if (profiles.some((profile) => profile.name.toLowerCase() === name.toLowerCase())) {
    throw new Error("An access profile with this name already exists.");
  }
  const now = new Date().toISOString();
  const profile = {
    id: `profile_${randomBytes(10).toString("hex")}`,
    name,
    description: String(input.description || "").trim(),
    isSystem: false,
    permissions: sanitizePermissions(input.permissions),
    createdAt: now,
    updatedAt: now
  };
  await writeCollection("accessProfiles", [...profiles, profile]);
  return profile;
}

export async function updateAccessProfile(id, input) {
  const profiles = await readCollection("accessProfiles");
  const current = profiles.find((profile) => profile.id === id);
  if (!current) return null;
  if (current.isSystem) throw new Error("The system administrator profile cannot be modified.");
  const name = String(input.name ?? current.name).trim();
  if (profiles.some((profile) => profile.id !== id && profile.name.toLowerCase() === name.toLowerCase())) {
    throw new Error("An access profile with this name already exists.");
  }
  const updated = {
    ...current,
    name,
    description: String(input.description ?? current.description).trim(),
    permissions: sanitizePermissions(input.permissions ?? current.permissions),
    updatedAt: new Date().toISOString()
  };
  await writeCollection("accessProfiles", profiles.map((profile) => profile.id === id ? updated : profile));
  return updated;
}

export async function deleteAccessProfile(id) {
  const profiles = await readCollection("accessProfiles");
  const profile = profiles.find((entry) => entry.id === id);
  if (!profile) return false;
  if (profile.isSystem) throw new Error("The system administrator profile cannot be deleted.");
  const users = await readCollection("users");
  if (users.some((user) => user.accessProfileId === id)) throw new Error("Reassign users before deleting this profile.");
  await writeCollection("accessProfiles", profiles.filter((entry) => entry.id !== id));
  return true;
}
