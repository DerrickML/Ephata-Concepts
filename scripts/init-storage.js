import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { COLLECTIONS, UPLOAD_FOLDERS } from "../src/lib/constants.js";
import { getUploadsRoot } from "../src/lib/uploads.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const dataDir = path.join(projectRoot, "data");
const uploadsRoot = getUploadsRoot();
const legacyUploadsRoot = path.resolve(projectRoot, "/storage/ephata/uploads");

async function ensureJsonFile(name, config) {
  const filePath = path.join(dataDir, config.file);
  try {
    await fs.access(filePath);
  } catch {
    const initial = config.type === "object" ? structuredClone(config.default || {}) : [];
    await fs.writeFile(filePath, `${JSON.stringify(initial, null, 2)}\n`);
  }
}

async function copyBrandAsset(sourceName, targetName) {
  const source = path.join(projectRoot, "logos-icons", sourceName);
  const target = path.join(uploadsRoot, "brand", targetName);
  try {
    await fs.access(source);
    await fs.copyFile(source, target);
  } catch {
    // Brand files are optional; the UI falls back to a text logo.
  }
}

async function migrateLegacyUploads() {
  if (path.normalize(legacyUploadsRoot) === path.normalize(uploadsRoot)) {
    return false;
  }

  try {
    await fs.access(legacyUploadsRoot);
    await fs.cp(legacyUploadsRoot, uploadsRoot, {
      recursive: true,
      force: false,
      errorOnExist: false
    });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await fs.mkdir(dataDir, { recursive: true });
  await Promise.all(
    Object.entries(COLLECTIONS).map(([name, config]) => ensureJsonFile(name, config))
  );

  await fs.mkdir(uploadsRoot, { recursive: true });
  await Promise.all(
    UPLOAD_FOLDERS.map((folder) => fs.mkdir(path.join(uploadsRoot, folder), { recursive: true }))
  );
  const migratedLegacyUploads = await migrateLegacyUploads();

  await copyBrandAsset("Ephata Logo RGB-01.png", "logo-primary.png");
  await copyBrandAsset("Ephata Logo RGB-02.png", "logo-secondary.png");
  await copyBrandAsset("Ephata Icon RGB-03.png", "icon.png");

  console.log(`Data folder ready: ${dataDir}`);
  console.log(`Upload storage ready: ${uploadsRoot}`);
  if (migratedLegacyUploads) {
    console.log(`Legacy upload files copied from: ${legacyUploadsRoot}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
