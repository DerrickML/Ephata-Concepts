# Ephata Concepts Website

Next.js website and administration system for Ephata Concepts. The application uses MySQL/MariaDB for content, authentication, RBAC, enquiries, settings, email state, and uploaded media.

## Tech Stack

- Next.js App Router
- React and JavaScript/JSX
- Tailwind CSS v4
- MySQL 8 or MariaDB 10.4+
- `mysql2` connection pooling
- TipTap rich-text editing
- Nodemailer SMTP integration

## Requirements

- Node.js 20 or newer
- MySQL 8+, MariaDB 10.4+, or XAMPP with MySQL/MariaDB
- A database account with access only to the application database
- `max_allowed_packet` of at least 32 MB because uploaded images are stored as `LONGBLOB`

## Installation

```bash
npm install
```

Create `.env.local` from `.env.example`. The required database settings are:

```env
NEXT_PUBLIC_SITE_URL=https://ephataconcepts.com
APP_ORIGIN=https://ephataconcepts.com
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=ephata_concepts
DB_USER=ephata_app
DB_PASSWORD=use-a-long-random-password
DB_CONNECTION_LIMIT=10
DB_SSL=false
DB_MIGRATION_USER=ephata_migrator
DB_MIGRATION_PASSWORD=use-a-separate-long-random-password
```

`APP_ORIGIN` is the authoritative origin for write-request CSRF validation. It must contain only the public scheme and host, with no path. `NEXT_PUBLIC_SITE_URL` should normally use the same value and is also used for metadata and public links.

`DB_USER` has runtime read/write permissions only. `DB_MIGRATION_USER` can change the schema and should be injected only while running migrations. Keep `DB_ADMIN_USER` and `DB_ADMIN_PASSWORD` out of the production runtime environment; they are used only by the optional provisioning command.

## XAMPP Setup

Start MySQL from the XAMPP Control Panel, configure `.env.local`, then run:

```bash
npm run db:setup
npm run db:migrate
```

`db:setup` creates a DML-only runtime user and a separate schema migration user using `DB_ADMIN_USER`, sets the running server's `max_allowed_packet` to 32 MB, and grants access only to `DB_NAME`.

To make the packet setting survive XAMPP restarts, edit `C:\xampp\mysql\bin\my.ini`:

```ini
[mysqld]
max_allowed_packet=32M
```

Restart MySQL from the XAMPP Control Panel afterward.

## Ubuntu MySQL or MariaDB Setup

Install and secure the database server if it is not already configured. Use the package that matches the VPS:

```bash
sudo apt update
sudo apt install mysql-server       # Oracle MySQL
# or
sudo apt install mariadb-server     # MariaDB
sudo mysql_secure_installation
```

Create the database and runtime user. Replace the example password before running this:

```sql
sudo mysql

CREATE DATABASE ephata_concepts
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER 'ephata_app'@'localhost'
  IDENTIFIED BY 'replace-with-a-long-random-password';

GRANT SELECT, INSERT, UPDATE, DELETE
  ON ephata_concepts.*
  TO 'ephata_app'@'localhost';

CREATE USER 'ephata_migrator'@'localhost'
  IDENTIFIED BY 'replace-with-a-different-long-random-password';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES, DROP
  ON ephata_concepts.*
  TO 'ephata_migrator'@'localhost';

FLUSH PRIVILEGES;
EXIT;
```

First inspect which configuration directories the installation includes:

```bash
grep -R "^[[:space:]]*!includedir" /etc/mysql/my.cnf /etc/mysql/mariadb.cnf 2>/dev/null
mysql --version
```

For Ubuntu MariaDB installations that contain `/etc/mysql/mariadb.conf.d`, create an application-specific override:

```bash
sudo tee /etc/mysql/mariadb.conf.d/60-ephata.cnf >/dev/null <<'EOF'
[mysqld]
max_allowed_packet=32M
EOF
```

For Oracle MySQL installations that contain `/etc/mysql/mysql.conf.d`, use this instead:

```bash
sudo tee /etc/mysql/mysql.conf.d/ephata.cnf >/dev/null <<'EOF'
[mysqld]
max_allowed_packet=32M
EOF
```

Do not create both files. Use the directory included by the installed server. The resulting configuration is:

```ini
[mysqld]
max_allowed_packet=32M
```

Then restart and verify the applicable service:

```bash
sudo systemctl restart mariadb   # MariaDB
# or
sudo systemctl restart mysql     # Oracle MySQL

sudo systemctl status mariadb --no-pager || sudo systemctl status mysql --no-pager
mysql -u ephata_app -p -e "SELECT VERSION(), @@max_allowed_packet;"
```

On a remote database server, bind MySQL to the private network only, restrict the database user's host, require TLS, and set `DB_SSL=true`.

## Database Migrations

Apply versioned schema migrations after every deployment:

```bash
npm run db:migrate
```

Run application commands as the normal deployment user, not with `sudo`. The database credentials are loaded from the project `.env.local` or `.env`; `sudo npm ...` can change the environment and create root-owned build or log files.

Before importing, verify that the runtime credentials work independently:

```bash
mysql -h 127.0.0.1 -P 3306 -u ephata_app -p ephata_concepts \
  -e "SELECT CURRENT_USER(), DATABASE();"
```

Enter the same password configured as `DB_PASSWORD`. If MariaDB rejects it, reset the account password as an administrator and make `.env.local` match:

```sql
sudo mariadb

CREATE USER IF NOT EXISTS 'ephata_app'@'localhost'
  IDENTIFIED BY 'replace-with-the-runtime-password';
ALTER USER 'ephata_app'@'localhost'
  IDENTIFIED BY 'replace-with-the-runtime-password';
GRANT SELECT, INSERT, UPDATE, DELETE
  ON ephata_concepts.*
  TO 'ephata_app'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Applied versions are recorded in `schema_migrations`, so the command is safe to rerun. Do not edit an applied migration; add a new migration instead.

The migration command uses `DB_MIGRATION_USER`; normal application requests use `DB_USER`. Remove migration credentials from the long-running process environment after deployment when your process manager supports deployment-only secrets.

The schema uses dedicated SQL tables for each application collection, indexed relationship columns, foreign keys for core category/user/enquiry relationships, JSON payloads for flexible content fields, and `media_assets` for binary uploads.

## One-Time JSON Migration

The legacy JSON files and `data/storage/uploads` directory are migration inputs only. Before importing, make a complete copy of `data/` and a database backup if the target database already contains records.

Run the following exactly once when moving an existing installation:

```bash
npm run db:migrate
npm run db:import
npm run db:verify
```

`db:import` is idempotent for the same source snapshot, but it synchronizes database collections to those files. Do not run it during routine deployments after users have started editing database content.

`db:verify` compares every legacy collection count and validates every imported media file by byte length and SHA-256 checksum. Runtime collections such as sessions, audit logs, email outbox entries, reset challenges, and account invitations can change during normal admin use; count drift in those collections is reported as a note instead of failing the verification.

For a new installation without legacy data, apply migrations and seed starter content instead:

```bash
npm run db:migrate
npm run seed
```

## Uploaded Media

Uploaded JPEG, PNG, WebP, and trusted brand SVG files are stored in `media_assets.content` as `LONGBLOB`. Metadata includes the stable storage key, MIME type, byte length, SHA-256 checksum, and timestamps.

Public URLs remain stable:

```txt
/api/uploads/{folder}/{filename}
```

The route reads the BLOB from MySQL and returns immutable caching headers and an ETag. Remote image URLs and static files under `public/` continue to work.

The application upload limit remains 10 MB. Keeping `max_allowed_packet` at 32 MB provides headroom for prepared-statement overhead and future metadata.

## Admin Managed Public Pages

The Settings area is the central editor for public page copy. It currently manages:

- Site-wide identity, contact details, logos, and fallback visuals
- Home page hero copy, trust strip labels, section prompts, process steps, statistics numbers, and final CTA
- About page hero, brand story, mission, values, team prompt, and CTA
- Services page hero, category helper copy, empty state, service detail helper copy, and CTA
- Packages page hero, category helper copy, empty state, and CTA
- Portfolio page hero, empty state, portfolio detail helper copy, and CTA
- Gallery page hero, display style, empty state, album/video labels, and CTA
- Testimonials page hero, empty state, and CTA
- Insights page hero, empty state, related insight section labels, and CTA
- Team page hero, category helper label, empty state, and CTA
- Social links shown in the footer, contact page, and consultation page
- Contact page copy and form labels
- Consultation page copy, preparation prompts, and form labels
- SMTP and email delivery settings

Home page statistics are edited under `Admin > Settings > Home Page` using:

```txt
Value | Label | Description
```

Example:

```txt
200+ | Events Managed | Weddings, retreats, launches, and professional gatherings.
50+ | Vendor Partners | Trusted teams coordinated around each event brief.
```

Gallery albums are managed under `Admin > Gallery`. Each album accepts up to four preview images, one required full album URL, and optional external video URLs. The public gallery layout is selected under `Admin > Settings > Gallery Page`.

## Development

```bash
npm run dev
```

Open `http://localhost:3000`. Admin login is available at `http://localhost:3000/admin/login`.

## Production Deployment

Set these exact public URL values on the Ephata production server:

```env
NEXT_PUBLIC_SITE_URL=https://ephataconcepts.com
APP_ORIGIN=https://ephataconcepts.com
```

The Nginx proxy location must preserve the public host and scheme:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

Validate and reload Nginx after changing its configuration:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Recommended deployment order on the Ubuntu VPS:

```bash
npm ci
npm run db:migrate
npm test
npm run build
npm start
```

When PM2 manages the process, restart it with the updated environment instead of running `npm start` separately:

```bash
pm2 restart ecosystem.config.cjs --update-env
pm2 logs --lines 100
```

For the first migration from JSON, stop application writes, back up both sources, run `db:import` and `db:verify`, then start the new build. Routine releases must omit `db:import`.

The database-backed store supports multiple Node processes, but each process has its own connection pool. Set `DB_CONNECTION_LIMIT` so the total across all processes remains below MySQL's `max_connections`.

## Backup and Restore

Because media is stored in the database, one `mysqldump` includes both records and uploaded files:

```bash
mysqldump -u ephata_app -p \
  --single-transaction \
  --quick \
  --hex-blob \
  --routines \
  ephata_concepts > ephata-concepts-$(date +%F-%H%M).sql
```

Restore into an empty database:

```bash
mysql -u ephata_app -p ephata_concepts < ephata-concepts-backup.sql
```

Test restores periodically. Keep encrypted off-server backups and apply a retention policy appropriate for enquiry and account data.

## Rollback

Before the first database cutover, retain:

- A compressed copy of the complete legacy `data/` directory
- The previous application release
- A MySQL dump taken immediately before import

If cutover validation fails, stop the new process, restore the previous release and its `data/` snapshot, and investigate against a copy of the database. The new runtime does not dual-write to JSON.

## Security Notes

- Never run the application with the MySQL root account.
- Keep `.env`, `.env.local`, database dumps, and `data/` out of git.
- Restrict production MySQL to localhost or a private network security group.
- Use TLS when the application and database are on different hosts.
- Rotate database and application secrets during production provisioning.
- Back up before schema migrations and test restores.

## Commands

```bash
npm run db:setup    # Provision a local database/user using admin credentials
npm run db:migrate  # Apply pending schema migrations
npm run db:import   # One-time import from legacy JSON and data/storage
npm run db:verify   # Compare legacy source counts and media checksums
npm run seed        # Seed starter content into an empty database
npm test            # Run JavaScript smoke tests
npm run build       # Create the production Next.js build
```

## Quality Checks

```bash
npm test
npm run db:verify
npm run build
```
