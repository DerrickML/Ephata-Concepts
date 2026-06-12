import { promises as fs } from "node:fs";
import path from "node:path";
import { loadProjectEnv } from "./env.js";

loadProjectEnv();

const { COLLECTIONS } = await import("../../src/lib/constants.js");
const { IMPORT_ORDER } = await import("../../src/lib/databaseSchema.js");
const { closeDatabasePool } = await import("../../src/lib/database.js");
const { writeCollection } = await import("../../src/lib/databaseStore.js");
const { putMediaAsset } = await import("../../src/lib/mediaStore.js");
const { contentTypeForPath, getUploadsRoot } = await import("../../src/lib/uploads.js");

const dataDir = path.join(process.cwd(), "data");

async function readLegacyCollection(name) {
  const config = COLLECTIONS[name];
  const filePath = path.join(dataDir, config.file);
  try {
    const parsed = JSON.parse(await fs.readFile(filePath, "utf8"));
    if (config.type === "array") return Array.isArray(parsed) ? parsed : [];
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : structuredClone(config.default || {});
  } catch (error) {
    if (error.code === "ENOENT") return config.type === "array" ? [] : structuredClone(config.default || {});
    throw error;
  }
}

async function walkFiles(directory, found = []) {
  try {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) await walkFiles(fullPath, found);
      else found.push(fullPath);
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  return found;
}

async function importMedia() {
  const root = getUploadsRoot();
  const files = await walkFiles(root);
  let totalBytes = 0;
  for (const filePath of files) {
    const [content, stats] = await Promise.all([fs.readFile(filePath), fs.stat(filePath)]);
    const storageKey = path.relative(root, filePath).split(path.sep).join("/");
    await putMediaAsset({
      storageKey,
      mimeType: contentTypeForPath(filePath),
      content,
      createdAt: stats.birthtime,
      updatedAt: stats.mtime
    });
    totalBytes += content.length;
  }
  console.log(`Imported media: ${files.length} file(s), ${totalBytes} byte(s).`);
}

async function main() {
  for (const name of IMPORT_ORDER) {
    const data = await readLegacyCollection(name);
    await writeCollection(name, data);
    console.log(`Imported ${name}: ${Array.isArray(data) ? data.length : 1} record(s).`);
  }
  await importMedia();
  console.log("JSON and media migration completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(closeDatabasePool);
