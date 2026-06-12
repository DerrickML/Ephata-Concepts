import { EVENT_TYPES } from "./constants.js";
import { isRichTextEmpty, normalizeRichTextDocument } from "./richText.js";
import { slugify } from "./slugify.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IMAGE_PATH_RE = /^(brand|portfolio|blog|testimonials|team|services|packages|temp)\/[a-zA-Z0-9._/-]+\.(jpg|jpeg|png|webp|svg)$/;
const PUBLIC_IMAGE_PATH_RE = /^\/[a-zA-Z0-9._/-]+\.(jpg|jpeg|png|webp|svg)$/;

export function cleanString(value, max = 2000) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

export function cleanMultiline(value, max = 10000) {
  return String(value || "").replace(/\r\n/g, "\n").trim().slice(0, max);
}

export function isEmail(value) {
  return EMAIL_RE.test(String(value || "").trim());
}

export function parseBoolean(value) {
  return value === true || value === "true" || value === "on" || value === 1;
}

export function parseSortOrder(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 999;
}

export function normalizeImagePath(value) {
  const input = cleanString(value, 2000);
  if (!input) {
    return "";
  }

  const uploadPath = input.replace(/^\/?api\/uploads\//, "");
  if (IMAGE_PATH_RE.test(uploadPath)) {
    return uploadPath;
  }

  if (!input.includes("..") && PUBLIC_IMAGE_PATH_RE.test(input)) {
    return input;
  }

  try {
    const url = new URL(input);
    if ((url.protocol === "http:" || url.protocol === "https:") && !url.username && !url.password) {
      return url.toString();
    }
  } catch {
    return "";
  }

  return "";
}

export function normalizeList(value, max = 300) {
  if (Array.isArray(value)) {
    return value.map((entry) => cleanString(entry, max)).filter(Boolean);
  }
  return String(value || "")
    .split(/\n|,/)
    .map((entry) => cleanString(entry, max))
    .filter(Boolean);
}

function normalizePrepItems(value) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => ({
        label: cleanString(entry?.label, 90),
        text: cleanString(entry?.text, 220)
      }))
      .filter((entry) => entry.label || entry.text);
  }

  return String(value || "")
    .split("\n")
    .map((entry) => {
      const [label, ...textParts] = entry.split("|");
      return {
        label: cleanString(label, 90),
        text: cleanString(textParts.join("|"), 220)
      };
    })
    .filter((entry) => entry.label || entry.text);
}

export function validateEnquiry(input) {
  const data = {
    fullName: cleanString(input.fullName, 120),
    email: cleanString(input.email, 160).toLowerCase(),
    phone: cleanString(input.phone, 60),
    eventType: cleanString(input.eventType, 120),
    eventDate: cleanString(input.eventDate, 40),
    eventLocation: cleanString(input.eventLocation, 160),
    guestCount: cleanString(input.guestCount, 80),
    estimatedBudget: cleanString(input.estimatedBudget, 160),
    serviceInterest: cleanString(input.serviceInterest, 160),
    message: cleanMultiline(input.message, 5000),
    source: ["contact", "consultation"].includes(input.source) ? input.source : "consultation",
    consent: parseBoolean(input.consent)
  };

  const errors = {};
  if (!data.fullName) errors.fullName = "Full name is required.";
  if (!isEmail(data.email)) errors.email = "A valid email address is required.";
  if (!data.eventType) errors.eventType = "Event type is required.";
  if (!data.serviceInterest) errors.serviceInterest = "Service interest is required.";
  if (!data.message) errors.message = "Please share a short message.";
  if (!data.consent) errors.consent = "Consent is required before submitting.";
  if (data.eventType && !EVENT_TYPES.includes(data.eventType) && data.eventType.length < 3) {
    errors.eventType = "Please choose a valid event type.";
  }

  delete data.consent;
  return { data, errors, ok: Object.keys(errors).length === 0 };
}

export function normalizeAdminPayload(collection, input) {
  const common = {
    published: parseBoolean(input.published ?? true),
    featured: parseBoolean(input.featured),
    sortOrder: parseSortOrder(input.sortOrder)
  };

  if (collection === "services") {
    return {
      ...common,
      title: cleanString(input.title, 160),
      slug: slugify(input.slug || input.title),
      categoryId: cleanString(input.categoryId, 160),
      description: cleanMultiline(input.description, 3000),
      rate: cleanString(input.rate || "Custom Quote", 80),
      image: normalizeImagePath(input.image)
    };
  }

  if (collection === "packages") {
    return {
      ...common,
      name: cleanString(input.name, 160),
      slug: slugify(input.slug || input.name),
      categoryId: cleanString(input.categoryId, 160),
      priceRange: cleanString(input.priceRange, 120),
      description: cleanMultiline(input.description, 3000),
      features: normalizeList(input.features),
      cta: cleanString(input.cta || "Book a Consultation", 80),
      image: normalizeImagePath(input.image)
    };
  }

  if (collection === "portfolio") {
    return {
      ...common,
      title: cleanString(input.title, 160),
      slug: slugify(input.slug || input.title),
      categoryId: cleanString(input.categoryId, 160),
      location: cleanString(input.location, 160),
      date: cleanString(input.date, 80),
      description: cleanMultiline(input.description, 5000),
      coverImage: normalizeImagePath(input.coverImage),
      gallery: normalizeList(input.gallery, 2000).map(normalizeImagePath).filter(Boolean)
    };
  }

  if (collection === "testimonials") {
    return {
      ...common,
      clientName: cleanString(input.clientName, 160),
      clientRole: cleanString(input.clientRole, 160),
      quote: cleanMultiline(input.quote, 3000),
      rating: Math.min(5, Math.max(1, Number(input.rating) || 5)),
      image: normalizeImagePath(input.image)
    };
  }

  if (collection === "insights") {
    return {
      ...common,
      title: cleanString(input.title, 180),
      slug: slugify(input.slug || input.title),
      categoryId: cleanString(input.categoryId, 160),
      excerpt: cleanMultiline(input.excerpt, 600),
      body: normalizeRichTextDocument(input.body, 12000),
      coverImage: normalizeImagePath(input.coverImage),
      author: cleanString(input.author || "Ephata Concepts", 120),
      publishedDate: cleanString(input.publishedDate, 60),
      tags: normalizeList(input.tags)
    };
  }

  if (["teamCategories", "serviceCategories", "packageCategories", "portfolioCategories", "insightCategories"].includes(collection)) {
    return {
      ...common,
      name: cleanString(input.name, 160),
      slug: slugify(input.slug || input.name),
      description: cleanMultiline(input.description, 800)
    };
  }

  if (collection === "teamMembers") {
    return {
      ...common,
      name: cleanString(input.name, 160),
      slug: slugify(input.slug || input.name),
      role: cleanString(input.role, 160),
      categoryId: cleanString(input.categoryId, 160),
      bio: cleanMultiline(input.bio, 1200),
      photo: normalizeImagePath(input.photo)
    };
  }

  if (collection === "enquiries") {
    return {
      status: ["new", "read", "archived"].includes(input.status) ? input.status : "new"
    };
  }

  if (collection === "contactPage") {
    return {
      heroTitle: cleanString(input.heroTitle, 160),
      heroIntro: cleanMultiline(input.heroIntro, 500),
      primaryCtaLabel: cleanString(input.primaryCtaLabel, 80),
      secondaryCtaLabel: cleanString(input.secondaryCtaLabel, 80),
      responseTitle: cleanString(input.responseTitle, 160),
      responseIntro: cleanMultiline(input.responseIntro, 500),
      noteItems: normalizeList(input.noteItems, 140),
      formTitle: cleanString(input.formTitle, 120),
      formIntro: cleanMultiline(input.formIntro, 500),
      submitLabel: cleanString(input.submitLabel, 80)
    };
  }

  if (collection === "consultationPage") {
    return {
      heroTitle: cleanString(input.heroTitle, 160),
      heroIntro: cleanMultiline(input.heroIntro, 500),
      rhythmLabel: cleanString(input.rhythmLabel, 80),
      rhythmText: cleanString(input.rhythmText, 180),
      prepTitle: cleanString(input.prepTitle, 120),
      prepItems: normalizePrepItems(input.prepItems),
      formTitle: cleanString(input.formTitle, 120),
      formIntro: cleanMultiline(input.formIntro, 500),
      submitLabel: cleanString(input.submitLabel, 80)
    };
  }

  return input;
}

export function validateAdminPayload(collection, payload) {
  const errors = {};
  if (collection === "services" && (!payload.title || !payload.categoryId)) {
    errors.title = "Title and category are required.";
  }
  if (collection === "packages" && (!payload.name || !payload.categoryId)) {
    errors.name = "Name and category are required.";
  }
  if (collection === "portfolio" && (!payload.title || !payload.categoryId)) {
    errors.title = "Title and type are required.";
  }
  if (collection === "testimonials" && (!payload.clientName || !payload.quote)) {
    errors.clientName = "Client name and quote are required.";
  }
  if (collection === "insights" && (!payload.title || !payload.categoryId || !payload.excerpt || isRichTextEmpty(payload.body))) {
    errors.title = "Title, category, excerpt, and body are required.";
  }
  if (["teamCategories", "serviceCategories", "packageCategories", "portfolioCategories", "insightCategories"].includes(collection) && !payload.name) {
    errors.name = "Name is required.";
  }
  if (collection === "teamMembers" && (!payload.name || !payload.role || !payload.categoryId)) {
    errors.name = "Name, role, and category are required.";
  }
  if (collection === "contactPage" && (!payload.heroTitle || !payload.formTitle)) {
    errors.heroTitle = "Hero title and form title are required.";
  }
  if (collection === "consultationPage" && (!payload.heroTitle || !payload.formTitle)) {
    errors.heroTitle = "Hero title and form title are required.";
  }
  return { ok: Object.keys(errors).length === 0, errors };
}
