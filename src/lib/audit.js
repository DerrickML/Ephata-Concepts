import { readCollection, writeCollection } from "./jsonStore.js";

const MAX_AUDIT_ENTRIES = 2500;

export async function recordAudit({ actor = null, action, section, targetId = "", summary = "", metadata = {} }) {
  const entries = await readCollection("auditLog");
  const entry = {
    id: `audit_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    actorId: actor?.id || null,
    actorName: actor?.name || actor?.username || "System",
    action,
    section,
    targetId,
    summary,
    metadata,
    createdAt: new Date().toISOString()
  };
  await writeCollection("auditLog", [...entries, entry].slice(-MAX_AUDIT_ENTRIES));
  return entry;
}
