import { promises as fs } from "fs";
import path from "path";
import { COLLECTIONS } from "./constants.js";
import { slugify, uniqueSlug } from "./slugify.js";

const DATA_DIR = path.join(process.cwd(), "data");

function getCollectionConfig(name) {
  const config = COLLECTIONS[name];
  if (!config) {
    throw new Error(`Unsupported collection: ${name}`);
  }
  return config;
}

function defaultValueFor(name) {
  const config = getCollectionConfig(name);
  if (config.type !== "object") {
    return [];
  }
  return structuredClone(config.default || {});
}

function collectionPath(name) {
  const config = getCollectionConfig(name);
  return path.join(DATA_DIR, config.file);
}

async function ensureCollectionFile(name) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const filePath = collectionPath(name);
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultValueFor(name), null, 2));
  }
  return filePath;
}

export async function readCollection(name) {
  const filePath = await ensureCollectionFile(name);
  const raw = await fs.readFile(filePath, "utf8");
  if (!raw.trim()) {
    return defaultValueFor(name);
  }

  try {
    const parsed = JSON.parse(raw);
    const expectedType = COLLECTIONS[name].type;
    if (expectedType === "array") {
      return Array.isArray(parsed) ? parsed : [];
    }
    const defaults = defaultValueFor(name);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? { ...defaults, ...parsed }
      : defaults;
  } catch {
    return defaultValueFor(name);
  }
}

export async function writeCollection(name, data) {
  getCollectionConfig(name);
  await fs.mkdir(DATA_DIR, { recursive: true });
  const filePath = collectionPath(name);
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, `${JSON.stringify(data, null, 2)}\n`);
  await fs.rename(tempPath, filePath);
  return data;
}

export async function getItemBySlug(name, itemSlug) {
  const items = await readCollection(name);
  if (!Array.isArray(items)) {
    return null;
  }
  return items.find((item) => item.slug === itemSlug) || null;
}

export async function createItem(name, item) {
  const items = await readCollection(name);
  if (!Array.isArray(items)) {
    throw new Error(`${name} is not a list collection`);
  }

  const now = new Date().toISOString();
  const title = item.title || item.name || name;
  const baseId =
    item.id ||
    (name === "enquiries"
      ? `enq_${Date.now().toString(36)}`
      : slugify(title) || `${name}_${Date.now()}`);
  const ids = new Set(items.map((entry) => entry.id));
  let id = baseId;
  let index = 2;
  while (ids.has(id)) {
    id = `${baseId}-${index}`;
    index += 1;
  }

  const next = {
    ...item,
    id,
    createdAt: item.createdAt || now,
    updatedAt: now
  };
  if (name !== "enquiries") {
    next.slug = item.slug || uniqueSlug(title, items);
  }
  await writeCollection(name, [...items, next]);
  return next;
}

export async function updateItem(name, id, patch) {
  const items = await readCollection(name);
  if (!Array.isArray(items)) {
    throw new Error(`${name} is not a list collection`);
  }

  let updatedItem = null;
  const nextItems = items.map((item) => {
    if (item.id !== id) {
      return item;
    }
    const merged = {
      ...item,
      ...patch,
      id: item.id,
      createdAt: item.createdAt,
      updatedAt: new Date().toISOString()
    };
    if (patch.title || patch.name || patch.slug) {
      merged.slug = patch.slug || uniqueSlug(patch.title || patch.name || item.slug, items, id);
    }
    updatedItem = merged;
    return merged;
  });

  if (!updatedItem) {
    return null;
  }
  await writeCollection(name, nextItems);
  return updatedItem;
}

export async function deleteItem(name, id) {
  const items = await readCollection(name);
  if (!Array.isArray(items)) {
    throw new Error(`${name} is not a list collection`);
  }
  const nextItems = items.filter((item) => item.id !== id);
  if (nextItems.length === items.length) {
    return false;
  }
  await writeCollection(name, nextItems);
  return true;
}

export async function updateSettings(patch) {
  return updateObjectCollection("settings", patch);
}

export async function updateObjectCollection(name, patch) {
  const current = await readCollection(name);
  if (Array.isArray(current)) {
    throw new Error(`${name} is not an object collection`);
  }
  const next = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString()
  };
  await writeCollection(name, next);
  return next;
}
