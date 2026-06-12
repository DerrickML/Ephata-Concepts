import { createHash, randomBytes } from "crypto";
import nodemailer from "nodemailer";
import { readCollection, updateObjectCollection, writeCollection } from "./jsonStore.js";
import { decryptEmailSecret, emailEncryptionAvailable, encryptEmailSecret } from "./secretBox.js";

const MAX_OUTBOX_ENTRIES = 2500;

function clean(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function normalizeSettings(input, current) {
  const port = Number(input.smtpPort ?? current.smtpPort ?? 587);
  return {
    ...current,
    smtpHost: clean(input.smtpHost ?? current.smtpHost, 240),
    smtpPort: Number.isInteger(port) && port > 0 && port < 65536 ? port : 587,
    smtpSecure: Object.prototype.hasOwnProperty.call(input, "smtpSecure")
      ? input.smtpSecure === true || input.smtpSecure === "true"
      : Boolean(current.smtpSecure),
    smtpUsername: clean(input.smtpUsername ?? current.smtpUsername, 240),
    fromName: clean(input.fromName ?? current.fromName, 160),
    fromEmail: clean(input.fromEmail ?? current.fromEmail, 240).toLowerCase(),
    replyTo: clean(input.replyTo ?? current.replyTo, 240).toLowerCase(),
    enquiryNotificationsEnabled: Object.prototype.hasOwnProperty.call(input, "enquiryNotificationsEnabled")
      ? input.enquiryNotificationsEnabled !== false
      : current.enquiryNotificationsEnabled !== false,
    accountInvitationsEnabled: Object.prototype.hasOwnProperty.call(input, "accountInvitationsEnabled")
      ? input.accountInvitationsEnabled !== false
      : current.accountInvitationsEnabled !== false,
    passwordResetEnabled: Object.prototype.hasOwnProperty.call(input, "passwordResetEnabled")
      ? input.passwordResetEnabled === true
      : Boolean(current.passwordResetEnabled)
  };
}

function passwordFor(settings) {
  return process.env.SMTP_PASSWORD || decryptEmailSecret(settings.smtpPasswordEncrypted);
}

function fingerprintFor(settings, password) {
  return createHash("sha256").update(JSON.stringify({
    host: settings.smtpHost,
    port: Number(settings.smtpPort),
    secure: Boolean(settings.smtpSecure),
    username: settings.smtpUsername,
    password,
    fromEmail: settings.fromEmail,
    replyTo: settings.replyTo
  })).digest("hex");
}

function configured(settings, password) {
  return Boolean(
    settings.smtpHost &&
    Number(settings.smtpPort) &&
    settings.fromEmail &&
    (!settings.smtpUsername || password)
  );
}

function transportFor(settings, password) {
  return nodemailer.createTransport({
    host: settings.smtpHost,
    port: Number(settings.smtpPort),
    secure: Boolean(settings.smtpSecure),
    auth: settings.smtpUsername ? { user: settings.smtpUsername, pass: password } : undefined,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  });
}

export async function getEmailRuntime() {
  const settings = await readCollection("emailSettings");
  const password = passwordFor(settings);
  const isConfigured = configured(settings, password);
  const fingerprint = isConfigured ? fingerprintFor(settings, password) : "";
  const verified = Boolean(isConfigured && settings.verifiedFingerprint === fingerprint && settings.lastVerifiedAt);
  return {
    settings,
    password,
    configured: isConfigured,
    verified,
    ready: verified,
    passwordConfigured: Boolean(password),
    passwordSource: process.env.SMTP_PASSWORD ? "environment" : settings.smtpPasswordEncrypted ? "encrypted" : "none",
    encryptionAvailable: emailEncryptionAvailable(),
    passwordResetAvailable: Boolean(verified && settings.passwordResetEnabled),
    accountInvitationsAvailable: Boolean(verified && settings.accountInvitationsEnabled)
  };
}

export async function getEmailSettingsView() {
  const runtime = await getEmailRuntime();
  const { smtpPasswordEncrypted, verifiedFingerprint, ...settings } = runtime.settings;
  return {
    ...settings,
    configured: runtime.configured,
    verified: runtime.verified,
    ready: runtime.ready,
    passwordConfigured: runtime.passwordConfigured,
    passwordSource: runtime.passwordSource,
    encryptionAvailable: runtime.encryptionAvailable,
    passwordResetAvailable: runtime.passwordResetAvailable,
    accountInvitationsAvailable: runtime.accountInvitationsAvailable
  };
}

export async function saveEmailSettings(input) {
  const current = await readCollection("emailSettings");
  const beforePassword = passwordFor(current);
  const beforeFingerprint = configured(current, beforePassword) ? fingerprintFor(current, beforePassword) : "";
  const next = normalizeSettings(input, current);
  if (clean(input.smtpPassword, 1000)) {
    next.smtpPasswordEncrypted = encryptEmailSecret(input.smtpPassword);
  }
  const nextPassword = passwordFor(next);
  const nextFingerprint = configured(next, nextPassword) ? fingerprintFor(next, nextPassword) : "";
  if (!nextFingerprint || nextFingerprint !== beforeFingerprint || current.verifiedFingerprint !== beforeFingerprint) {
    next.verifiedFingerprint = "";
    next.lastVerifiedAt = null;
    next.lastVerificationError = "";
    next.passwordResetEnabled = false;
  }
  if (!nextFingerprint) next.passwordResetEnabled = false;
  await updateObjectCollection("emailSettings", next);
  return getEmailSettingsView();
}

export async function verifyEmailSettings() {
  const runtime = await getEmailRuntime();
  if (!runtime.configured) throw new Error("Complete the SMTP host, port, sender address, and authentication settings first.");
  try {
    const transporter = transportFor(runtime.settings, runtime.password);
    await transporter.verify();
    const verifiedFingerprint = fingerprintFor(runtime.settings, runtime.password);
    await updateObjectCollection("emailSettings", {
      verifiedFingerprint,
      lastVerifiedAt: new Date().toISOString(),
      lastVerificationError: ""
    });
    return getEmailSettingsView();
  } catch (error) {
    await updateObjectCollection("emailSettings", {
      verifiedFingerprint: "",
      lastVerifiedAt: null,
      lastVerificationError: clean(error.message || "SMTP verification failed.", 500),
      passwordResetEnabled: false
    });
    throw new Error("SMTP verification failed. Check the host, port, TLS mode, and credentials.");
  }
}

export async function queueEmail({ type, to, subject, text, html, relatedType = "", relatedId = "", metadata = {} }) {
  const recipients = [...new Set((Array.isArray(to) ? to : [to]).map((entry) => clean(entry, 240).toLowerCase()).filter(Boolean))];
  if (!recipients.length) return null;
  const entries = await readCollection("emailOutbox");
  const now = new Date().toISOString();
  const item = {
    id: `mail_${randomBytes(10).toString("hex")}`,
    type: clean(type, 80),
    to: recipients,
    subject: clean(subject, 300),
    text: String(text || "").slice(0, 50000),
    html: String(html || "").slice(0, 100000),
    relatedType: clean(relatedType, 80),
    relatedId: clean(relatedId, 200),
    metadata,
    status: "pending",
    attempts: 0,
    lastError: "",
    providerMessageId: "",
    createdAt: now,
    updatedAt: now,
    sentAt: null
  };
  await writeCollection("emailOutbox", [...entries, item].slice(-MAX_OUTBOX_ENTRIES));
  return item;
}

export async function deliverQueuedEmail(id) {
  const entries = await readCollection("emailOutbox");
  const item = entries.find((entry) => entry.id === id);
  if (!item || item.status === "sent") return item || null;
  const runtime = await getEmailRuntime();
  const now = new Date().toISOString();
  if (!runtime.ready) {
    const pending = { ...item, status: "pending", lastError: "SMTP is not configured and verified.", updatedAt: now };
    await writeCollection("emailOutbox", entries.map((entry) => entry.id === id ? pending : entry));
    return pending;
  }
  try {
    const transporter = transportFor(runtime.settings, runtime.password);
    const result = await transporter.sendMail({
      from: { name: runtime.settings.fromName || "Ephata Concepts", address: runtime.settings.fromEmail },
      to: item.to,
      replyTo: runtime.settings.replyTo || runtime.settings.fromEmail,
      subject: item.subject,
      text: item.text,
      html: item.html || undefined
    });
    const sent = { ...item, status: "sent", attempts: item.attempts + 1, lastError: "", providerMessageId: result.messageId || "", sentAt: now, updatedAt: now };
    await writeCollection("emailOutbox", entries.map((entry) => entry.id === id ? sent : entry));
    return sent;
  } catch (error) {
    const failed = { ...item, status: "failed", attempts: item.attempts + 1, lastError: clean(error.message || "Delivery failed.", 500), updatedAt: now };
    await writeCollection("emailOutbox", entries.map((entry) => entry.id === id ? failed : entry));
    return failed;
  }
}

export async function queueAndAttemptEmail(message) {
  const queued = await queueEmail(message);
  return queued ? deliverQueuedEmail(queued.id) : null;
}

export async function retryEmailOutbox(limit = 20) {
  const entries = await readCollection("emailOutbox");
  const candidates = entries.filter((entry) => entry.status !== "sent").slice(0, Math.max(1, Math.min(100, limit)));
  const results = [];
  for (const item of candidates) results.push(await deliverQueuedEmail(item.id));
  return results;
}

export function escapeEmailHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

export function emailShell(title, content) {
  return `<!doctype html><html><body style="margin:0;background:#f5f2ec;font-family:Arial,sans-serif;color:#142641"><div style="max-width:640px;margin:0 auto;padding:32px 18px"><div style="background:#fff;border:1px solid #e4ddd1;padding:28px"><p style="margin:0 0 8px;color:#b7832f;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">Ephata Concepts</p><h1 style="margin:0 0 18px;font-family:Georgia,serif;font-weight:500">${escapeEmailHtml(title)}</h1>${content}</div><p style="color:#6a7079;font-size:12px;line-height:1.5">This is an automated message from the Ephata Concepts administration system.</p></div></body></html>`;
}
