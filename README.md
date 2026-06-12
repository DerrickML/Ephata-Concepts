# Ephata Concepts Website

Production-ready Next.js website for Ephata Concepts, an event planning and coordination company based in Kampala, Uganda.

The first version uses JSON files for content management and stores uploaded images in a private server-side data directory. This keeps the frontend CMS-ready while avoiding a database dependency for the MVP.

## Tech Stack

- Next.js App Router
- JavaScript and JSX only
- React
- Tailwind CSS v4 with custom CSS
- JSON file data store
- Node.js filesystem utilities
- Private upload storage exposed through safe API routes

## Installation

```bash
npm install
```

## Environment Variables

Create `.env.local`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me-now
ADMIN_SESSION_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`ADMIN_PASSWORD` is read from environment variables and is not stored in JSON. For production, replace the MVP plain password check with a hashed password flow.

## Initialize Storage

```bash
npm run init-storage
```

This creates:

```txt
data/storage/uploads/brand
data/storage/uploads/portfolio
data/storage/uploads/blog
data/storage/uploads/testimonials
data/storage/uploads/services
data/storage/uploads/packages
data/storage/uploads/temp
```

The script also creates missing JSON files in `data/`, copies supplied brand PNGs from `logos-icons/` into the private brand upload folder when present, and copies legacy files from `/storage/ephata/uploads` into `data/storage/uploads` when that old folder exists.

## Seed Starter Content

```bash
npm run seed
```

Use `-- --force` to overwrite existing seeded content:

```bash
npm run seed -- --force
```

## Development

```bash
npm run dev
```

Then open:

```txt
http://localhost:3000
```

Admin login:

```txt
http://localhost:3000/admin/login
```

Default local credentials if environment variables are not set:

```txt
username: admin
password: change-me-now
```

## Production Build

```bash
npm run build
npm start
```

## Server Data Storage

Images are not stored under `public/uploads`. Admin uploads are saved under:

```txt
data/storage/uploads
```

The `data/` directory is ignored by git and should be treated as server-side runtime data. Uploaded media is exposed only through the safe image route:

```txt
/api/uploads/{folder}/{filename}
```

Example:

```txt
/api/uploads/portfolio/wedding-setup.webp
```

The route validates paths and blocks traversal attempts such as `../../etc/passwd`.

Allowed image types:

- JPEG
- PNG
- WebP
- SVG only for trusted brand assets

Maximum upload size is 10 MB.

## JSON Data Store

Content lives beside media in the private `data/` directory:

```txt
data/services.json
data/packages.json
data/portfolio.json
data/testimonials.json
data/insights.json
data/enquiries.json
data/settings.json
```

Writes use a temporary file followed by rename for atomic replacement.

Important production note: while JSON files and local media files are the active data store, run the app as a single process and back up `data/` separately. Avoid PM2 cluster mode or multi-instance writes until a cross-process file lock or database/CMS migration is added.

Future migration note: `data/` is the MVP persistence boundary. The JSON collections should map cleanly to database tables/documents later, and `data/storage/uploads` can migrate to object storage without changing the public `/api/uploads/...` URL shape immediately.

## Admin Features

- Protected admin dashboard
- Services CRUD
- Packages CRUD
- Portfolio CRUD
- Testimonials CRUD
- Insights CRUD
- Enquiry review, status updates, and deletion
- Site settings
- Server-side image uploads

## Quality Checks

```bash
npm test
npm run build
```

`npm test` verifies the JavaScript-only constraint, upload path safety, enquiry validation, and key files.
