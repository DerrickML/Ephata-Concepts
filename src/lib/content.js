export function sortByOrder(items) {
  return [...(items || [])].sort((a, b) => {
    const order = (a.sortOrder || 999) - (b.sortOrder || 999);
    if (order !== 0) return order;
    return String(a.title || a.name || a.clientName || "").localeCompare(
      String(b.title || b.name || b.clientName || "")
    );
  });
}

export function published(items) {
  return sortByOrder((items || []).filter((item) => item.published !== false));
}

export function featured(items, limit = 3) {
  return published(items)
    .filter((item) => item.featured)
    .slice(0, limit);
}

export function groupBy(items, key) {
  return published(items).reduce((groups, item) => {
    const group = item[key] || "Other";
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
}

export function paragraphs(value) {
  return String(value || "")
    .split(/\n{2,}/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

