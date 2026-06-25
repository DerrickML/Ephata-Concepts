export const id = "002_gallery_albums";

export async function up(connection) {
  await connection.query(`CREATE TABLE IF NOT EXISTS gallery_albums (
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
    KEY idx_position (position)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
}
