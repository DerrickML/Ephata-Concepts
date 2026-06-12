function publishedTimestamp(item) {
  const value = Date.parse(item?.publishedDate || item?.createdAt || "");
  return Number.isFinite(value) ? value : 0;
}

function normalizedTags(item) {
  return new Set((item?.tags || []).map((tag) => String(tag).trim().toLocaleLowerCase()).filter(Boolean));
}

export function sortInsightsByDate(items = []) {
  return [...items].sort((a, b) => {
    const dateOrder = publishedTimestamp(b) - publishedTimestamp(a);
    if (dateOrder !== 0) return dateOrder;
    return String(a.title || "").localeCompare(String(b.title || ""));
  });
}

export function relatedInsights(current, items = [], limit = 6) {
  if (!current) return [];
  const currentTags = normalizedTags(current);

  return items
    .filter((item) => item.id !== current.id)
    .map((item) => {
      const sharedTags = [...normalizedTags(item)].filter((tag) => currentTags.has(tag)).length;
      const sameCategory = item.categoryId === current.categoryId;
      return {
        item,
        score: sharedTags * 4 + (sameCategory ? 3 : 0)
      };
    })
    .sort((a, b) => {
      const scoreOrder = b.score - a.score;
      if (scoreOrder !== 0) return scoreOrder;
      return publishedTimestamp(b.item) - publishedTimestamp(a.item);
    })
    .slice(0, limit)
    .map(({ item }) => item);
}
