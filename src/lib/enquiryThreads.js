import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { readCollection, updateItem, writeCollection } from "./jsonStore.js";

function tokenSecret() {
  return process.env.ENQUIRY_TOKEN_SECRET || process.env.ADMIN_SESSION_SECRET || "replace-with-long-random-secret";
}

function signature(encodedId) {
  return createHmac("sha256", tokenSecret()).update(encodedId).digest("base64url");
}

export function conversationTokenFor(enquiryId) {
  const encodedId = Buffer.from(String(enquiryId)).toString("base64url");
  return `${encodedId}.${signature(encodedId)}`;
}

export async function getEnquiryByConversationToken(token) {
  const [encodedId, providedSignature] = String(token || "").split(".");
  if (!encodedId || !providedSignature) return null;
  const expected = Buffer.from(signature(encodedId));
  const provided = Buffer.from(providedSignature);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null;
  let enquiryId = "";
  try {
    enquiryId = Buffer.from(encodedId, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const enquiries = await readCollection("enquiries");
  return enquiries.find((entry) => entry.id === enquiryId) || null;
}

export async function getEnquiryMessages(enquiryId) {
  const messages = await readCollection("enquiryMessages");
  return messages
    .filter((message) => message.enquiryId === enquiryId)
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
}

export async function addEnquiryMessage({ enquiryId, direction, senderName, senderEmail, recipientEmail, body, actorId = null, deliveryStatus = "received", emailOutboxId = null }) {
  const messages = await readCollection("enquiryMessages");
  const now = new Date().toISOString();
  const message = {
    id: `message_${randomBytes(10).toString("hex")}`,
    enquiryId,
    direction,
    senderName: String(senderName || "").trim().slice(0, 160),
    senderEmail: String(senderEmail || "").trim().toLowerCase().slice(0, 240),
    recipientEmail: String(recipientEmail || "").trim().toLowerCase().slice(0, 240),
    body: String(body || "").trim().slice(0, 10000),
    actorId,
    deliveryStatus,
    emailOutboxId,
    createdAt: now,
    updatedAt: now
  };
  await writeCollection("enquiryMessages", [...messages, message]);
  await updateItem("enquiries", enquiryId, {
    lastMessageAt: now,
    messageCount: (messages.filter((entry) => entry.enquiryId === enquiryId).length || 0) + 1
  });
  return message;
}

export async function updateEnquiryMessageDelivery(messageId, deliveryStatus, emailOutboxId = null) {
  const messages = await readCollection("enquiryMessages");
  let updated = null;
  await writeCollection("enquiryMessages", messages.map((message) => {
    if (message.id !== messageId) return message;
    updated = { ...message, deliveryStatus, emailOutboxId: emailOutboxId || message.emailOutboxId, updatedAt: new Date().toISOString() };
    return updated;
  }));
  return updated;
}

export async function deleteEnquiryMessages(enquiryId) {
  const messages = await readCollection("enquiryMessages");
  await writeCollection("enquiryMessages", messages.filter((message) => message.enquiryId !== enquiryId));
}
