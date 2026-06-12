import { NextResponse } from "next/server";
import {
  createItem,
  deleteItem,
  readCollection,
  updateItem,
  updateObjectCollection,
  updateSettings,
  writeCollection
} from "./jsonStore.js";
import { authorizeRequest, invalidOrigin, sameOrigin } from "./auth.js";
import { COLLECTION_SECTION } from "./accessControl.js";
import { recordAudit } from "./audit.js";
import { normalizeAdminPayload, normalizeImagePath, validateAdminPayload } from "./validators.js";
import { deleteEnquiryMessages } from "./enquiryThreads.js";
import {
  CATEGORY_COLLECTION_CONFIG,
  CONTENT_CATEGORY_CONFIG,
  createUncategorizedCategory,
  reassignCategoryRecords,
  UNCATEGORIZED_CATEGORY_ID
} from "./contentCategories.js";
import { normalizeSocialLinks } from "./socialLinks.js";

export function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorJson(message, status = 400, details = undefined) {
  return NextResponse.json({ error: message, details }, { status });
}

async function validateCategoryReference(collection, payload) {
  const config = CONTENT_CATEGORY_CONFIG[collection];
  if (!config) return null;

  const categories = await readCollection(config.categoryCollection);
  if (!categories.some((category) => category.id === payload.categoryId)) {
    return errorJson(`${config.categoryLabel} does not exist.`, 422, {
      categoryId: `Choose an existing ${config.categoryLabel.toLowerCase()}.`
    });
  }
  return null;
}

async function validateUniqueCategory(collection, payload, currentId = null) {
  if (!CATEGORY_COLLECTION_CONFIG[collection]) return null;
  const categories = await readCollection(collection);
  const normalizedName = payload.name.toLocaleLowerCase();
  const duplicate = categories.some(
    (category) => category.id !== currentId && String(category.name || "").toLocaleLowerCase() === normalizedName
  );
  return duplicate ? errorJson("A category with this name already exists.", 409) : null;
}

export async function listCollection(request, collection) {
  const auth = await authorizeRequest(request, COLLECTION_SECTION[collection], "view");
  if (!auth.ok) return auth.response;
  const items = await readCollection(collection);
  return json({ items });
}

export async function createCollectionItem(request, collection) {
  if (!sameOrigin(request)) return invalidOrigin();
  const auth = await authorizeRequest(request, COLLECTION_SECTION[collection], "create");
  if (!auth.ok) return auth.response;
  const input = await request.json();
  const payload = normalizeAdminPayload(collection, input);
  const validation = validateAdminPayload(collection, payload);
  if (!validation.ok) {
    return errorJson("Validation failed", 422, validation.errors);
  }
  const categoryError =
    (await validateCategoryReference(collection, payload)) ||
    (await validateUniqueCategory(collection, payload));
  if (categoryError) return categoryError;
  const item = await createItem(collection, payload);
  await recordAudit({ actor: auth.admin, action: "create", section: COLLECTION_SECTION[collection], targetId: item.id, summary: `Created ${collection} record` });
  return json({ item }, 201);
}

export async function updateCollectionItem(request, collection, id) {
  if (!sameOrigin(request)) return invalidOrigin();
  const auth = await authorizeRequest(request, COLLECTION_SECTION[collection], "edit");
  if (!auth.ok) return auth.response;
  if (CATEGORY_COLLECTION_CONFIG[collection] && id === UNCATEGORIZED_CATEGORY_ID) {
    return errorJson("The Uncategorized system category cannot be edited.", 409);
  }
  const input = await request.json();
  const payload = normalizeAdminPayload(collection, input);
  const validation = validateAdminPayload(collection, payload);
  if (!validation.ok) {
    return errorJson("Validation failed", 422, validation.errors);
  }
  const categoryError =
    (await validateCategoryReference(collection, payload)) ||
    (await validateUniqueCategory(collection, payload, id));
  if (categoryError) return categoryError;
  const item = await updateItem(collection, id, payload);
  if (!item) {
    return errorJson("Item not found", 404);
  }
  await recordAudit({ actor: auth.admin, action: "edit", section: COLLECTION_SECTION[collection], targetId: id, summary: `Updated ${collection} record` });
  return json({ item });
}

export async function deleteCollectionItem(request, collection, id) {
  if (!sameOrigin(request)) return invalidOrigin();
  const auth = await authorizeRequest(request, COLLECTION_SECTION[collection], "delete");
  if (!auth.ok) return auth.response;
  const categoryConfig = CATEGORY_COLLECTION_CONFIG[collection];
  if (categoryConfig) {
    if (id === UNCATEGORIZED_CATEGORY_ID) {
      return errorJson("The Uncategorized system category cannot be deleted.", 409);
    }

    const [categories, records] = await Promise.all([
      readCollection(collection),
      readCollection(categoryConfig.recordCollection)
    ]);
    if (!categories.some((category) => category.id === id)) {
      return errorJson("Item not found", 404);
    }

    const fallbackExists = categories.some((category) => category.id === UNCATEGORIZED_CATEGORY_ID);
    const categoriesWithFallback = fallbackExists
      ? categories
      : [...categories, createUncategorizedCategory()];
    if (!fallbackExists) {
      await writeCollection(collection, categoriesWithFallback);
    }

    const { items: reassignedRecords, reassignedCount } = reassignCategoryRecords(records, id);
    if (reassignedCount) {
      await writeCollection(categoryConfig.recordCollection, reassignedRecords);
    }
    await writeCollection(
      collection,
      categoriesWithFallback.filter((category) => category.id !== id)
    );
    await recordAudit({
      actor: auth.admin,
      action: "delete",
      section: COLLECTION_SECTION[collection],
      targetId: id,
      summary: `Deleted ${collection} record and reassigned ${reassignedCount} linked record(s)`
    });
    return json({ ok: true, reassignedCount });
  }
  const deleted = await deleteItem(collection, id);
  if (!deleted) {
    return errorJson("Item not found", 404);
  }
  await recordAudit({ actor: auth.admin, action: "delete", section: COLLECTION_SECTION[collection], targetId: id, summary: `Deleted ${collection} record` });
  return json({ ok: true });
}

export async function updateEnquiryStatus(request, id) {
  if (!sameOrigin(request)) return invalidOrigin();
  const auth = await authorizeRequest(request, "enquiries", "edit");
  if (!auth.ok) return auth.response;
  const input = await request.json();
  const payload = normalizeAdminPayload("enquiries", input);
  const item = await updateItem("enquiries", id, payload);
  if (!item) {
    return errorJson("Enquiry not found", 404);
  }
  await recordAudit({ actor: auth.admin, action: "edit", section: "enquiries", targetId: id, summary: "Updated enquiry status" });
  return json({ item });
}

export async function deleteEnquiry(request, id) {
  if (!sameOrigin(request)) return invalidOrigin();
  const auth = await authorizeRequest(request, "enquiries", "delete");
  if (!auth.ok) return auth.response;
  const deleted = await deleteItem("enquiries", id);
  if (!deleted) {
    return errorJson("Enquiry not found", 404);
  }
  await deleteEnquiryMessages(id);
  await recordAudit({ actor: auth.admin, action: "delete", section: "enquiries", targetId: id, summary: "Deleted enquiry" });
  return json({ ok: true });
}

export async function getSettings(request) {
  const auth = await authorizeRequest(request, "settings", "view");
  if (!auth.ok) return auth.response;
  const settings = await readCollection("settings");
  return json({ settings });
}

export async function putSettings(request) {
  if (!sameOrigin(request)) return invalidOrigin();
  const auth = await authorizeRequest(request, "settings", "edit");
  if (!auth.ok) return auth.response;
  const input = await request.json();
  const allowedKeys = [
    "siteName",
    "tagline",
    "description",
    "email",
    "phone",
    "location",
    "instagram",
    "facebook",
    "linkedin",
    "socialLinks",
    "logoPrimary",
    "logoSecondary",
    "icon",
    "heroImage",
    "aboutImage",
    "corporateImage"
  ];
  const imageKeys = new Set(["logoPrimary", "logoSecondary", "icon", "heroImage", "aboutImage", "corporateImage"]);
  const patch = {};
  for (const key of allowedKeys) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      patch[key] = key === "socialLinks"
        ? normalizeSocialLinks(input[key])
        : imageKeys.has(key)
        ? normalizeImagePath(input[key])
        : String(input[key] || "").trim();
    }
  }
  if (Object.prototype.hasOwnProperty.call(input, "socialLinks")) {
    patch.socialLinksConfigured = true;
  }
  const settings = await updateSettings(patch);
  await recordAudit({ actor: auth.admin, action: "edit", section: "settings", targetId: "site-settings", summary: "Updated site settings" });
  return json({ settings });
}

export async function getPageContent(request, collection) {
  const auth = await authorizeRequest(request, "settings", "view");
  if (!auth.ok) return auth.response;
  const page = await readCollection(collection);
  return json({ page });
}

export async function putPageContent(request, collection) {
  if (!sameOrigin(request)) return invalidOrigin();
  const auth = await authorizeRequest(request, "settings", "edit");
  if (!auth.ok) return auth.response;
  const input = await request.json();
  const payload = normalizeAdminPayload(collection, input);
  const validation = validateAdminPayload(collection, payload);
  if (!validation.ok) {
    return errorJson("Validation failed", 422, validation.errors);
  }
  const page = await updateObjectCollection(collection, payload);
  await recordAudit({ actor: auth.admin, action: "edit", section: "settings", targetId: collection, summary: `Updated ${collection}` });
  return json({ page });
}
