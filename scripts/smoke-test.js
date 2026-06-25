import assert from "assert/strict";
import { promises as fs } from "fs";
import path from "path";
import { slugify } from "../src/lib/slugify.js";
import { safeUploadPath } from "../src/lib/uploads.js";
import { publicUploadUrl } from "../src/lib/uploadUrls.js";
import { normalizeAdminPayload, validateAdminPayload, validateEnquiry } from "../src/lib/validators.js";
import {
  createUncategorizedCategory,
  enrichCategorizedItems,
  groupedCategorizedItems,
  reassignCategoryRecords,
  UNCATEGORIZED_CATEGORY_ID
} from "../src/lib/contentCategories.js";
import { canGrantPermissions, fullPermissions, resolvePermissions } from "../src/lib/accessControl.js";
import { hashPassword, verifyPassword } from "../src/lib/passwords.js";
import { decryptEmailSecret, encryptEmailSecret } from "../src/lib/secretBox.js";
import { conversationTokenFor } from "../src/lib/enquiryThreads.js";
import { relatedInsights, sortInsightsByDate } from "../src/lib/insights.js";
import { normalizeRichTextDocument } from "../src/lib/richText.js";
import { normalizeSocialLinks, resolveSocialLinks } from "../src/lib/socialLinks.js";
import { indexedRecordFields, tableForCollection } from "../src/lib/databaseSchema.js";
import { publicRequestOrigin, sameOrigin } from "../src/lib/requestOrigin.js";

const root = process.cwd();

async function walk(dir, found = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, found);
    } else {
      found.push(full);
    }
  }
  return found;
}

assert.equal(slugify("Full Event Planning"), "full-event-planning");
assert.equal(publicUploadUrl("portfolio/sample.webp"), "/api/uploads/portfolio/sample.webp");
assert.throws(() => safeUploadPath("../etc/passwd"), /Invalid|Unsafe/);
assert.equal(tableForCollection("services"), "services");
assert.equal(tableForCollection("galleryAlbums"), "gallery_albums");
assert.equal(indexedRecordFields({ categoryId: "planning", published: true }, 3).categoryId, "planning");
assert.equal(indexedRecordFields({ categoryId: "planning", published: true }, 3).position, 3);

const previousAppOrigin = process.env.APP_ORIGIN;
const previousSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
process.env.APP_ORIGIN = "https://ephataconcepts.com";
delete process.env.NEXT_PUBLIC_SITE_URL;
const proxiedWriteRequest = new Request("http://127.0.0.1:3000/api/admin/services/example", {
  method: "PUT",
  headers: {
    origin: "https://ephataconcepts.com",
    "x-forwarded-host": "ephataconcepts.com",
    "x-forwarded-proto": "https"
  }
});
assert.equal(publicRequestOrigin(proxiedWriteRequest), "https://ephataconcepts.com");
assert.equal(sameOrigin(proxiedWriteRequest), true);
assert.equal(sameOrigin(new Request("http://127.0.0.1:3000/api/admin/services/example", {
  method: "PUT",
  headers: { origin: "https://attacker.example" }
})), false);
if (previousAppOrigin === undefined) delete process.env.APP_ORIGIN;
else process.env.APP_ORIGIN = previousAppOrigin;
if (previousSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
else process.env.NEXT_PUBLIC_SITE_URL = previousSiteUrl;

const valid = validateEnquiry({
  fullName: "Example Client",
  email: "client@example.com",
  eventType: "Wedding",
  serviceInterest: "Full Event Planning",
  message: "We need planning support.",
  consent: true
});
assert.equal(valid.ok, true);

const invalid = validateEnquiry({ email: "bad" });
assert.equal(invalid.ok, false);

const normalizedService = normalizeAdminPayload("services", {
  title: "Example Service",
  categoryId: "planning"
});
assert.equal(normalizedService.categoryId, "planning");
assert.equal(Object.hasOwn(normalizedService, "category"), false);
assert.equal(validateAdminPayload("services", normalizedService).ok, true);

const categoryFixtures = [
  { id: "planning", name: "Planning", published: true, sortOrder: 1 }
];
const categorizedFixtures = enrichCategorizedItems(
  [{ id: "service", title: "Example", categoryId: "planning", published: true }],
  categoryFixtures
);
assert.equal(categorizedFixtures[0].categoryName, "Planning");
assert.equal(groupedCategorizedItems(categorizedFixtures, categoryFixtures)[0].items.length, 1);
assert.equal(createUncategorizedCategory("2026-01-01T00:00:00.000Z").id, UNCATEGORIZED_CATEGORY_ID);
const reassignment = reassignCategoryRecords(
  [{ id: "one", categoryId: "old" }, { id: "two", categoryId: "keep" }],
  "old",
  UNCATEGORIZED_CATEGORY_ID,
  "2026-01-01T00:00:00.000Z"
);
assert.equal(reassignment.reassignedCount, 1);
assert.equal(reassignment.items[0].categoryId, UNCATEGORIZED_CATEGORY_ID);
assert.equal(reassignment.items[1].categoryId, "keep");

const insightFixtures = [
  { id: "current", title: "Current", categoryId: "planning", tags: ["Weddings"], publishedDate: "2026-01-01" },
  { id: "shared-tag", title: "Shared Tag", categoryId: "design", tags: ["weddings"], publishedDate: "2026-02-01" },
  { id: "shared-category", title: "Shared Category", categoryId: "planning", tags: [], publishedDate: "2026-03-01" },
  { id: "recent", title: "Recent", categoryId: "other", tags: [], publishedDate: "2026-04-01" }
];
assert.equal(sortInsightsByDate(insightFixtures)[0].id, "recent");
assert.deepEqual(
  relatedInsights(insightFixtures[0], insightFixtures).map((item) => item.id),
  ["shared-tag", "shared-category", "recent"]
);

const normalizedInsight = normalizeAdminPayload("insights", {
  title: "Example Insight",
  categoryId: "planning-guides",
  excerpt: "A useful summary.",
  body: "A useful article body."
});
assert.equal(normalizedInsight.categoryId, "planning-guides");
assert.equal(validateAdminPayload("insights", normalizedInsight).ok, true);

const normalizedHomePage = normalizeAdminPayload("homePage", {
  heroTitle: "Graceful events.",
  heroIntro: "Calm support for modern gatherings.",
  ctaTitle: "Start with clarity.",
  statisticsItems: "200+ | Events Managed | Coordinated with care\n50+ | Vendor Partners | Trusted delivery teams",
  processItems: "Consultation | Clarify priorities"
});
assert.equal(normalizedHomePage.statisticsItems[0].value, "200+");
assert.equal(normalizedHomePage.processItems[0].label, "Consultation");
assert.equal(validateAdminPayload("homePage", normalizedHomePage).ok, true);

const normalizedAboutPage = normalizeAdminPayload("aboutPage", {
  pageLabel: "About",
  heroTitle: "A calm opening.",
  heroIntro: "Events held with care.",
  valuesItems: "Excellence | Refined details",
  ctaTitle: "Begin with clarity."
});
assert.equal(normalizedAboutPage.valuesItems[0].label, "Excellence");
assert.equal(validateAdminPayload("aboutPage", normalizedAboutPage).ok, true);

const normalizedServicesPage = normalizeAdminPayload("servicesPage", {
  pageLabel: "Services",
  heroTitle: "Support that composes the day.",
  heroIntro: "Planning and coordination.",
  detailPrimaryHref: "https://example.com/unsafe",
  detailBackHref: "/services",
  ctaTitle: "Start"
});
assert.equal(normalizedServicesPage.detailPrimaryHref, "/book-consultation");
assert.equal(normalizedServicesPage.detailBackHref, "/services");
assert.equal(validateAdminPayload("servicesPage", normalizedServicesPage).ok, true);

const normalizedInsightsPage = normalizeAdminPayload("insightsPage", {
  pageLabel: "Insights",
  heroTitle: "Notes for calmer events.",
  heroIntro: "Brief guidance.",
  relatedTitle: "Related reads.",
  ctaButtonHref: "/book-consultation",
  ctaTitle: "Start"
});
assert.equal(normalizedInsightsPage.relatedTitle, "Related reads.");
assert.equal(validateAdminPayload("insightsPage", normalizedInsightsPage).ok, true);

const normalizedGalleryAlbum = normalizeAdminPayload("galleryAlbums", {
  title: "Launch Night",
  externalAlbumUrl: "https://gallery.example.com/launch-night",
  images: [
    "gallery/one.webp",
    "gallery/two.webp",
    "gallery/three.webp",
    "gallery/four.webp",
    "gallery/five.webp"
  ],
  videoLinks: "https://video.example.com/watch\njavascript:alert(1)"
});
assert.equal(normalizedGalleryAlbum.images.length, 4);
assert.deepEqual(normalizedGalleryAlbum.videoLinks, ["https://video.example.com/watch"]);
assert.equal(validateAdminPayload("galleryAlbums", normalizedGalleryAlbum).ok, true);

const normalizedGalleryPage = normalizeAdminPayload("galleryPage", {
  pageLabel: "Gallery",
  heroTitle: "Albums",
  heroIntro: "Selected previews.",
  displayStyle: "masonry",
  ctaTitle: "Start"
});
assert.equal(normalizedGalleryPage.displayStyle, "masonry");
assert.equal(validateAdminPayload("galleryPage", normalizedGalleryPage).ok, true);

const alignedRichText = normalizeRichTextDocument({
  type: "doc",
  content: [
    { type: "heading", attrs: { level: 2, textAlign: "center" }, content: [{ type: "text", text: "Centered" }] },
    { type: "paragraph", attrs: { textAlign: "justify" }, content: [{ type: "text", text: "Justified copy" }] },
    { type: "paragraph", attrs: { textAlign: "unsafe" }, content: [{ type: "text", text: "Safe fallback" }] }
  ]
});
assert.equal(alignedRichText.content[0].attrs.textAlign, "center");
assert.equal(alignedRichText.content[1].attrs.textAlign, "justify");
assert.equal(Object.hasOwn(alignedRichText.content[2], "attrs"), false);

const socialLinks = normalizeSocialLinks([
  { id: "instagram", label: "Instagram", url: "https://instagram.com/ephata", icon: "camera", enabled: true },
  { id: "unsafe", label: "Unsafe", url: "javascript:alert(1)", icon: "camera", enabled: true },
  { id: "fallback-icon", label: "Website", url: "https://example.com", icon: "not-an-icon", enabled: false }
]);
assert.equal(socialLinks.length, 2);
assert.equal(socialLinks[0].icon, "camera");
assert.equal(socialLinks[1].icon, "link");
assert.equal(socialLinks[1].enabled, false);
assert.deepEqual(
  normalizeSocialLinks([
    { id: "duplicate", label: "First", url: "https://example.com/first" },
    { id: "duplicate", label: "Second", url: "https://example.com/second" }
  ]).map((link) => link.id),
  ["duplicate", "duplicate-2"]
);
assert.equal(resolveSocialLinks({ instagram: "https://instagram.com/ephata" })[0].label, "Instagram");
assert.deepEqual(resolveSocialLinks({ socialLinks: [], socialLinksConfigured: true, instagram: "https://instagram.com/ephata" }), []);

const resolvedPermissions = resolvePermissions(
  { services: ["view", "create", "edit"] },
  { services: { allow: ["delete"], deny: ["create"] } }
);
assert.deepEqual(resolvedPermissions.services, ["view", "edit", "delete"]);
assert.equal(canGrantPermissions({ permissions: fullPermissions() }, resolvedPermissions), true);
assert.equal(canGrantPermissions({ permissions: { services: ["view"] } }, resolvedPermissions), false);

const passwordHash = await hashPassword("temporary-password");
assert.equal(await verifyPassword("temporary-password", passwordHash), true);
assert.equal(await verifyPassword("wrong-password", passwordHash), false);

process.env.EMAIL_SECRETS_KEY = "smoke-test-email-secret";
const encryptedEmailSecret = encryptEmailSecret("smtp-password");
assert.notEqual(encryptedEmailSecret, "smtp-password");
assert.equal(decryptEmailSecret(encryptedEmailSecret), "smtp-password");
assert.match(conversationTokenFor("enq_example"), /^[^.]+\.[A-Za-z0-9_-]+$/);

const allFiles = await walk(root);
assert.equal(allFiles.some((file) => file.endsWith("tsconfig.json")), false);
assert.equal(allFiles.some((file) => /\.tsx?$/.test(file)), false);

for (const file of [
  "src/app/api/uploads/[...path]/route.js",
  "src/app/api/admin/public-pages/[page]/route.js",
  "src/app/api/admin/gallery-albums/route.js",
  "src/app/api/admin/gallery-albums/[id]/route.js",
  "src/app/api/enquiries/route.js",
  "src/lib/jsonStore.js",
  "src/lib/databaseStore.js",
  "src/lib/mediaStore.js",
  "src/lib/requestOrigin.js",
  "src/lib/uploads.js",
  "src/lib/auth.js"
]) {
  await fs.access(path.join(root, file));
}

console.log("Smoke tests passed.");
