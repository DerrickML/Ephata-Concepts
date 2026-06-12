import { published, sortByOrder } from "./content.js";

export const UNCATEGORIZED_CATEGORY_ID = "uncategorized";

export function createUncategorizedCategory(now = new Date().toISOString()) {
  return {
    id: UNCATEGORIZED_CATEGORY_ID,
    slug: UNCATEGORIZED_CATEGORY_ID,
    name: "Uncategorized",
    description: "Content awaiting a category assignment.",
    system: true,
    published: true,
    featured: false,
    sortOrder: 9999,
    createdAt: now,
    updatedAt: now
  };
}

export function reassignCategoryRecords(
  records = [],
  deletedCategoryId,
  fallbackCategoryId = UNCATEGORIZED_CATEGORY_ID,
  updatedAt = new Date().toISOString()
) {
  let reassignedCount = 0;
  const items = records.map((record) => {
    if (record.categoryId !== deletedCategoryId) return record;
    reassignedCount += 1;
    return { ...record, categoryId: fallbackCategoryId, updatedAt };
  });
  return { items, reassignedCount };
}

export const CONTENT_CATEGORY_CONFIG = {
  services: {
    categoryCollection: "serviceCategories",
    categoryLabel: "Service Category"
  },
  packages: {
    categoryCollection: "packageCategories",
    categoryLabel: "Package Category"
  },
  portfolio: {
    categoryCollection: "portfolioCategories",
    categoryLabel: "Portfolio Type"
  },
  insights: {
    categoryCollection: "insightCategories",
    categoryLabel: "Insight Category"
  }
};

export const CATEGORY_COLLECTION_CONFIG = {
  ...Object.fromEntries(
  Object.entries(CONTENT_CATEGORY_CONFIG).map(([recordCollection, config]) => [
    config.categoryCollection,
    { ...config, recordCollection }
  ])
  ),
  teamCategories: {
    recordCollection: "teamMembers",
    categoryLabel: "Team Category"
  }
};

export function contentCategoryMap(categories = []) {
  return new Map((categories || []).map((category) => [category.id, category]));
}

export function enrichCategorizedItems(items = [], categories = []) {
  const categoriesById = contentCategoryMap(categories);
  const categoriesByName = new Map(
    (categories || []).map((category) => [String(category.name || "").toLocaleLowerCase(), category])
  );
  return sortByOrder(items).map((item) => {
    const legacyName = item.category || item.eventType;
    const category =
      categoriesById.get(item.categoryId) ||
      categoriesByName.get(String(legacyName || "").toLocaleLowerCase());
    return {
      ...item,
      categoryId: item.categoryId || category?.id || "",
      category,
      categoryName: category?.name || "Uncategorized"
    };
  });
}

export function publishedCategorizedItems(items = [], categories = []) {
  const visibleCategoryIds = new Set(published(categories).map((category) => category.id));
  return enrichCategorizedItems(published(items), categories).filter((item) =>
    visibleCategoryIds.has(item.categoryId)
  );
}

export function groupedCategorizedItems(items = [], categories = []) {
  const visibleItems = publishedCategorizedItems(items, categories);
  return published(categories)
    .map((category) => ({
      ...category,
      items: visibleItems.filter((item) => item.categoryId === category.id)
    }))
    .filter((category) => category.items.length);
}

export function categoryOptions(categories = []) {
  return sortByOrder(categories).map((category) => ({
    label: category.name,
    value: category.id
  }));
}
