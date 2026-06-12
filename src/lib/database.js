import mysql from "mysql2/promise";

const globalDatabase = globalThis;

function numberFromEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function databaseConfig(overrides = {}) {
  const config = {
    host: process.env.DB_HOST || "127.0.0.1",
    port: numberFromEnv("DB_PORT", 3306),
    user: process.env.DB_USER || "ephata_app",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ephata_concepts",
    waitForConnections: true,
    connectionLimit: numberFromEnv("DB_CONNECTION_LIMIT", 10),
    queueLimit: 0,
    charset: "utf8mb4",
    timezone: "Z",
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ...overrides
  };

  if (process.env.DB_SOCKET_PATH) {
    config.socketPath = process.env.DB_SOCKET_PATH;
    delete config.host;
    delete config.port;
  }

  if (process.env.DB_SSL === "true") {
    config.ssl = { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false" };
  }

  return config;
}

export function migrationDatabaseConfig() {
  return databaseConfig({
    user: process.env.DB_MIGRATION_USER || process.env.DB_USER || "ephata_app",
    password: process.env.DB_MIGRATION_PASSWORD || process.env.DB_PASSWORD || ""
  });
}

export function getDatabasePool() {
  if (!globalDatabase.__ephataDatabasePool) {
    globalDatabase.__ephataDatabasePool = mysql.createPool(databaseConfig());
  }
  return globalDatabase.__ephataDatabasePool;
}

export async function withTransaction(callback) {
  const connection = await getDatabasePool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function closeDatabasePool() {
  if (globalDatabase.__ephataDatabasePool) {
    await globalDatabase.__ephataDatabasePool.end();
    delete globalDatabase.__ephataDatabasePool;
  }
}
