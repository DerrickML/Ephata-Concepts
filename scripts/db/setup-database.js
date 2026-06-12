import mysql from "mysql2/promise";
import { loadProjectEnv } from "./env.js";

loadProjectEnv();

function safeIdentifier(value, label) {
  const text = String(value || "");
  if (!/^[A-Za-z0-9_]+$/.test(text)) throw new Error(`${label} may contain only letters, numbers, and underscores.`);
  return text;
}

async function main() {
  const host = process.env.DB_HOST || "127.0.0.1";
  const port = Number(process.env.DB_PORT || 3306);
  const database = safeIdentifier(process.env.DB_NAME || "ephata_concepts", "DB_NAME");
  const appUser = safeIdentifier(process.env.DB_USER || "ephata_app", "DB_USER");
  const appPassword = process.env.DB_PASSWORD;
  if (!appPassword) throw new Error("DB_PASSWORD must be set before database setup.");
  const migrationUser = safeIdentifier(process.env.DB_MIGRATION_USER || `${appUser}_migrator`, "DB_MIGRATION_USER");
  const migrationPassword = process.env.DB_MIGRATION_PASSWORD;
  if (!migrationPassword) throw new Error("DB_MIGRATION_PASSWORD must be set before database setup.");

  const connection = await mysql.createConnection({
    host,
    port,
    user: process.env.DB_ADMIN_USER || "root",
    password: process.env.DB_ADMIN_PASSWORD || "",
    charset: "utf8mb4"
  });
  try {
    const userHost = process.env.DB_USER_HOST || "localhost";
    const migrationUserHost = process.env.DB_MIGRATION_USER_HOST || userHost;
    const escapedUser = connection.escape(appUser);
    const escapedHost = connection.escape(userHost);
    const escapedPassword = connection.escape(appPassword);
    const escapedMigrationUser = connection.escape(migrationUser);
    const escapedMigrationHost = connection.escape(migrationUserHost);
    const escapedMigrationPassword = connection.escape(migrationPassword);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`CREATE USER IF NOT EXISTS ${escapedUser}@${escapedHost} IDENTIFIED BY ${escapedPassword}`);
    await connection.query(`ALTER USER ${escapedUser}@${escapedHost} IDENTIFIED BY ${escapedPassword}`);
    await connection.query(`REVOKE ALL PRIVILEGES, GRANT OPTION FROM ${escapedUser}@${escapedHost}`);
    await connection.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON \`${database}\`.* TO ${escapedUser}@${escapedHost}`);
    await connection.query(`CREATE USER IF NOT EXISTS ${escapedMigrationUser}@${escapedMigrationHost} IDENTIFIED BY ${escapedMigrationPassword}`);
    await connection.query(`ALTER USER ${escapedMigrationUser}@${escapedMigrationHost} IDENTIFIED BY ${escapedMigrationPassword}`);
    await connection.query(`REVOKE ALL PRIVILEGES, GRANT OPTION FROM ${escapedMigrationUser}@${escapedMigrationHost}`);
    await connection.query(`GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES, DROP ON \`${database}\`.* TO ${escapedMigrationUser}@${escapedMigrationHost}`);
    await connection.query("SET GLOBAL max_allowed_packet = 33554432");
    await connection.query("FLUSH PRIVILEGES");
    console.log(`Database ${database}, runtime user ${appUser}@${userHost}, and migration user ${migrationUser}@${migrationUserHost} are ready.`);
    console.log("max_allowed_packet set to 32 MB for the running server.");
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
