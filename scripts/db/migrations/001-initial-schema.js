import { ARRAY_COLLECTION_TABLES } from "../../../src/lib/databaseSchema.js";

export const id = "001_initial_schema";

const relations = {
  users: "CONSTRAINT fk_users_profile FOREIGN KEY (access_profile_id) REFERENCES access_profiles(id) ON DELETE RESTRICT",
  sessions: "CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE",
  services: "CONSTRAINT fk_services_category FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE SET NULL",
  packages: "CONSTRAINT fk_packages_category FOREIGN KEY (category_id) REFERENCES package_categories(id) ON DELETE SET NULL",
  portfolio: "CONSTRAINT fk_portfolio_category FOREIGN KEY (category_id) REFERENCES portfolio_categories(id) ON DELETE SET NULL",
  insights: "CONSTRAINT fk_insights_category FOREIGN KEY (category_id) REFERENCES insight_categories(id) ON DELETE SET NULL",
  team_members: "CONSTRAINT fk_team_members_category FOREIGN KEY (category_id) REFERENCES team_categories(id) ON DELETE SET NULL",
  enquiry_messages: "CONSTRAINT fk_enquiry_messages_enquiry FOREIGN KEY (parent_id) REFERENCES enquiries(id) ON DELETE CASCADE",
  password_reset_challenges: "CONSTRAINT fk_password_resets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE",
  account_invitations: "CONSTRAINT fk_account_invitations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE"
};

function tableSql(table) {
  const extraKeys = [];
  if (table === "users") {
    extraKeys.push("UNIQUE KEY uq_users_email (email)", "UNIQUE KEY uq_users_username (username)");
  }
  if (table === "sessions") extraKeys.push("UNIQUE KEY uq_sessions_token_hash (token_hash)");
  if (relations[table]) extraKeys.push(relations[table]);
  const extras = extraKeys.length ? `,\n      ${extraKeys.join(",\n      ")}` : "";

  return `CREATE TABLE IF NOT EXISTS \`${table}\` (
      id VARCHAR(191) NOT NULL,
      slug VARCHAR(191) NULL,
      category_id VARCHAR(191) NULL,
      parent_id VARCHAR(191) NULL,
      user_id VARCHAR(191) NULL,
      access_profile_id VARCHAR(191) NULL,
      email VARCHAR(255) NULL,
      username VARCHAR(191) NULL,
      token_hash VARCHAR(191) NULL,
      status VARCHAR(64) NULL,
      sort_order INT NULL,
      published TINYINT(1) NULL,
      position INT NOT NULL DEFAULT 0,
      payload JSON NOT NULL,
      created_at DATETIME(3) NULL,
      updated_at DATETIME(3) NULL,
      PRIMARY KEY (id),
      UNIQUE KEY uq_slug (slug),
      KEY idx_category_id (category_id),
      KEY idx_parent_id (parent_id),
      KEY idx_user_id (user_id),
      KEY idx_access_profile_id (access_profile_id),
      KEY idx_status (status),
      KEY idx_published_sort (published, sort_order),
      KEY idx_position (position)${extras}
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;
}

export async function up(connection) {
  await connection.query(`CREATE TABLE IF NOT EXISTS site_documents (
    name VARCHAR(100) NOT NULL,
    payload JSON NOT NULL,
    updated_at DATETIME(3) NOT NULL,
    PRIMARY KEY (name)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  for (const table of Object.values(ARRAY_COLLECTION_TABLES)) {
    await connection.query(tableSql(table));
  }

  await connection.query(`CREATE TABLE IF NOT EXISTS media_assets (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    storage_key VARCHAR(500) NOT NULL,
    folder VARCHAR(64) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(120) NOT NULL,
    size_bytes BIGINT UNSIGNED NOT NULL,
    sha256 CHAR(64) NOT NULL,
    content LONGBLOB NOT NULL,
    created_at DATETIME(3) NOT NULL,
    updated_at DATETIME(3) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_media_storage_key (storage_key),
    KEY idx_media_folder (folder),
    KEY idx_media_sha256 (sha256)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
}
