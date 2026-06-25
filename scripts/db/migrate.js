import { loadProjectEnv } from "./env.js";
import mysql from "mysql2/promise";

loadProjectEnv();

const migrations = [
  await import("./migrations/001-initial-schema.js"),
  await import("./migrations/002-gallery-albums.js")
];
const { migrationDatabaseConfig } = await import("../../src/lib/database.js");
const pool = mysql.createPool(migrationDatabaseConfig());

async function main() {
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    id VARCHAR(191) NOT NULL,
    applied_at DATETIME(3) NOT NULL,
    PRIMARY KEY (id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  const [rows] = await pool.query("SELECT id FROM schema_migrations");
  const applied = new Set(rows.map((row) => row.id));

  for (const migration of migrations) {
    if (applied.has(migration.id)) {
      console.log(`Already applied: ${migration.id}`);
      continue;
    }
    const connection = await pool.getConnection();
    try {
      console.log(`Applying: ${migration.id}`);
      await migration.up(connection);
      await connection.execute("INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)", [migration.id, new Date()]);
      console.log(`Applied: ${migration.id}`);
    } finally {
      connection.release();
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
