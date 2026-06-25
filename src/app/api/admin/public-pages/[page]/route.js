import { errorJson, getPageContent, putPageContent } from "@/lib/adminApi.js";

export const runtime = "nodejs";

const PAGE_COLLECTIONS = {
  about: "aboutPage",
  services: "servicesPage",
  packages: "packagesPage",
  portfolio: "portfolioPage",
  gallery: "galleryPage",
  testimonials: "testimonialsPage",
  insights: "insightsPage",
  team: "teamPage"
};

async function collectionFromParams(params) {
  const { page } = await params;
  return PAGE_COLLECTIONS[page] || null;
}

export async function GET(request, { params }) {
  const collection = await collectionFromParams(params);
  if (!collection) return errorJson("Unknown public page.", 404);
  return getPageContent(request, collection);
}

export async function PUT(request, { params }) {
  const collection = await collectionFromParams(params);
  if (!collection) return errorJson("Unknown public page.", 404);
  return putPageContent(request, collection);
}
