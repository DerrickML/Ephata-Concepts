import { COLLECTIONS } from "./constants.js";
import { getDatabasePool, withTransaction } from "./database.js";
import {
  indexedRecordFields,
  OBJECT_COLLECTIONS,
  tableForCollection
} from "./databaseSchema.js";
import { slugify, uniqueSlug } from "./slugify.js";

function getCollectionConfig(name) {
  const config = COLLECTIONS[name];
  if (!config) throw new Error(`Unsupported collection: ${name}`);
  return config;
}

function defaultValueFor(name) {
  const config = getCollectionConfig(name);
  return config.type === "object" ? structuredClone(config.default || {}) : [];
}

function parsePayload(payload) {
  if (payload && typeof payload === "object" && !Buffer.isBuffer(payload)) return payload;
  return JSON.parse(String(payload || "{}"));
}

function sqlDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function rowValues(item, position) {
  const indexed = indexedRecordFields(item, position);
  return [
    item.id,
    indexed.slug,
    indexed.categoryId,
    indexed.parentId,
    indexed.userId,
    indexed.accessProfileId,
    indexed.email,
    indexed.username,
    indexed.tokenHash,
    indexed.status,
    indexed.sortOrder,
    indexed.published,
    indexed.position,
    JSON.stringify(item),
    sqlDate(indexed.createdAt),
    sqlDate(indexed.updatedAt)
  ];
}

async function readArray(connection, name, { lock = false } = {}) {
  const table = tableForCollection(name);
  if (!table) throw new Error(`No SQL table configured for ${name}`);
  const [rows] = await connection.query(
    `SELECT payload FROM \`${table}\` ORDER BY position ASC, created_at ASC${lock ? " FOR UPDATE" : ""}`
  );
  return rows.map((row) => parsePayload(row.payload));
}

async function upsertRecord(connection, table, item, position) {
  await connection.execute(
    `INSERT INTO \`${table}\` (
      id, slug, category_id, parent_id, user_id, access_profile_id, email, username,
      token_hash, status, sort_order, published, position, payload, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      slug = VALUES(slug), category_id = VALUES(category_id), parent_id = VALUES(parent_id),
      user_id = VALUES(user_id), access_profile_id = VALUES(access_profile_id), email = VALUES(email),
      username = VALUES(username), token_hash = VALUES(token_hash), status = VALUES(status),
      sort_order = VALUES(sort_order), published = VALUES(published), position = VALUES(position),
      payload = VALUES(payload), created_at = VALUES(created_at), updated_at = VALUES(updated_at)`,
    rowValues(item, position)
  );
}

async function writeArray(connection, name, items) {
  const table = tableForCollection(name);
  if (!Array.isArray(items)) throw new Error(`${name} is a list collection`);
  await connection.query(`SELECT id FROM \`${table}\` FOR UPDATE`);
  for (let index = 0; index < items.length; index += 1) {
    await upsertRecord(connection, table, items[index], index);
  }
  if (items.length) {
    const placeholders = items.map(() => "?").join(", ");
    await connection.query(
      `DELETE FROM \`${table}\` WHERE id NOT IN (${placeholders})`,
      items.map((item) => item.id)
    );
  } else {
    await connection.query(`DELETE FROM \`${table}\``);
  }
  return items;
}

export async function readCollection(name) {
  const config = getCollectionConfig(name);
  const pool = getDatabasePool();
  if (config.type === "array") return readArray(pool, name);
  if (!OBJECT_COLLECTIONS.has(name)) throw new Error(`No SQL document configured for ${name}`);
  const [rows] = await pool.execute("SELECT payload FROM site_documents WHERE name = ? LIMIT 1", [name]);
  const defaults = defaultValueFor(name);
  return rows.length ? { ...defaults, ...parsePayload(rows[0].payload) } : defaults;
}

export async function writeCollection(name, data) {
  const config = getCollectionConfig(name);
  if (config.type === "array") {
    return withTransaction((connection) => writeArray(connection, name, data));
  }
  if (!OBJECT_COLLECTIONS.has(name)) throw new Error(`No SQL document configured for ${name}`);
  const updatedAt = sqlDate(data?.updatedAt) || new Date();
  await getDatabasePool().execute(
    `INSERT INTO site_documents (name, payload, updated_at) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE payload = VALUES(payload), updated_at = VALUES(updated_at)`,
    [name, JSON.stringify(data), updatedAt]
  );
  return data;
}

export async function getItemBySlug(name, itemSlug) {
  const table = tableForCollection(name);
  if (!table) return null;
  const [rows] = await getDatabasePool().execute(
    `SELECT payload FROM \`${table}\` WHERE slug = ? LIMIT 1`,
    [itemSlug]
  );
  return rows.length ? parsePayload(rows[0].payload) : null;
}

export async function createItem(name, item) {
  return withTransaction(async (connection) => {
    const items = await readArray(connection, name, { lock: true });
    const now = new Date().toISOString();
    const title = item.title || item.name || name;
    const baseId = item.id || (name === "enquiries"
      ? `enq_${Date.now().toString(36)}`
      : slugify(title) || `${name}_${Date.now()}`);
    const ids = new Set(items.map((entry) => entry.id));
    let id = baseId;
    let index = 2;
    while (ids.has(id)) {
      id = `${baseId}-${index}`;
      index += 1;
    }
    const next = { ...item, id, createdAt: item.createdAt || now, updatedAt: now };
    if (name !== "enquiries") next.slug = item.slug || uniqueSlug(title, items);
    await upsertRecord(connection, tableForCollection(name), next, items.length);
    return next;
  });
}

export async function updateItem(name, id, patch) {
  return withTransaction(async (connection) => {
    const items = await readArray(connection, name, { lock: true });
    const itemIndex = items.findIndex((item) => item.id === id);
    if (itemIndex < 0) return null;
    const current = items[itemIndex];
    const merged = {
      ...current,
      ...patch,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString()
    };
    if (patch.title || patch.name || patch.slug) {
      merged.slug = patch.slug || uniqueSlug(patch.title || patch.name || current.slug, items, id);
    }
    await upsertRecord(connection, tableForCollection(name), merged, itemIndex);
    return merged;
  });
}

export async function deleteItem(name, id) {
  const table = tableForCollection(name);
  if (!table) throw new Error(`${name} is not a list collection`);
  const [result] = await getDatabasePool().execute(`DELETE FROM \`${table}\` WHERE id = ?`, [id]);
  return result.affectedRows > 0;
}

export async function updateSettings(patch) {
  return updateObjectCollection("settings", patch);
}

export async function updateObjectCollection(name, patch) {
  const current = await readCollection(name);
  if (Array.isArray(current)) throw new Error(`${name} is not an object collection`);
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  await writeCollection(name, next);
  return next;
}
