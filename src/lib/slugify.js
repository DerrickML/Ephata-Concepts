export function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function uniqueSlug(base, items, currentId) {
  const root = slugify(base) || "item";
  const existing = new Set(
    items
      .filter((item) => item.id !== currentId)
      .map((item) => item.slug)
      .filter(Boolean)
  );

  if (!existing.has(root)) {
    return root;
  }

  let index = 2;
  while (existing.has(`${root}-${index}`)) {
    index += 1;
  }
  return `${root}-${index}`;
}

