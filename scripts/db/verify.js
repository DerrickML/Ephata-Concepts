import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { loadProjectEnv } from "./env.js";

loadProjectEnv();

const { COLLECTIONS } = await import("../../src/lib/constants.js");
const { IMPORT_ORDER } = await import("../../src/lib/databaseSchema.js");
const { closeDatabasePool, getDatabasePool } = await import("../../src/lib/database.js");
const { readCollection } = await import("../../src/lib/databaseStore.js");
const { getUploadsRoot } = await import("../../src/lib/uploads.js");

const failures = [];
const driftNotes = [];
const VOLATILE_COLLECTIONS = new Set([
  "sessions",
  "auditLog",
  "emailOutbox",
  "passwordResetChallenges",
  "accountInvitations"
]);

async function sourceCollection(name) {
  const config = COLLECTIONS[name];
  try {
    return JSON.parse(await fs.readFile(path.join(process.cwd(), "data", config.file), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return config.type === "array" ? [] : structuredClone(config.default || {});
    throw error;
  }
}

async function walk(directory, found = []) {
  try {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const filePath = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(filePath, found);
      else found.push(filePath);
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  return found;
}

async function main() {
  for (const name of IMPORT_ORDER) {
    const [source, target] = await Promise.all([sourceCollection(name), readCollection(name)]);
    const sourceCount = Array.isArray(source) ? source.length : 1;
    const targetCount = Array.isArray(target) ? target.length : 1;
    if (sourceCount !== targetCount) {
      const message = `${name}: source=${sourceCount}, database=${targetCount}`;
      if (VOLATILE_COLLECTIONS.has(name)) driftNotes.push(message);
      else failures.push(message);
    }
    console.log(`${name}: ${targetCount} record(s)`);
  }

  const root = getUploadsRoot();
  const files = await walk(root);
  const [rows] = await getDatabasePool().query("SELECT storage_key, size_bytes, sha256 FROM media_assets");
  const databaseMedia = new Map(rows.map((row) => [row.storage_key, row]));
  for (const filePath of files) {
    const content = await fs.readFile(filePath);
    const key = path.relative(root, filePath).split(path.sep).join("/");
    const row = databaseMedia.get(key);
    const checksum = createHash("sha256").update(content).digest("hex");
    if (!row || Number(row.size_bytes) !== content.length || row.sha256 !== checksum) failures.push(`media mismatch: ${key}`);
  }
  if (databaseMedia.size !== files.length) failures.push(`media count: source=${files.length}, database=${databaseMedia.size}`);
  console.log(`media_assets: ${databaseMedia.size} file(s)`);

  if (driftNotes.length) {
    console.log("Runtime collection drift noted:");
    for (const note of driftNotes) console.log(`- ${note}`);
  }

  if (failures.length) throw new Error(`Migration verification failed:\n- ${failures.join("\n- ")}`);
  console.log("Migration verification passed.");
}

main()
  .catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  })
  .finally(closeDatabasePool);
