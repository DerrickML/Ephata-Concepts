import { published, sortByOrder } from "./content.js";

export function teamCategoryMap(categories = []) {
  return new Map((categories || []).map((category) => [category.id, category]));
}

export function enrichTeamMembers(members = [], categories = []) {
  const categoriesById = teamCategoryMap(categories);
  return sortByOrder(members || []).map((member) => {
    const category = categoriesById.get(member.categoryId);
    return {
      ...member,
      category,
      categoryName: category?.name || "Team"
    };
  });
}

export function publishedTeamMembers(members = [], categories = []) {
  const publishedCategories = new Set(published(categories).map((category) => category.id));
  return enrichTeamMembers(
    published(members).filter((member) => publishedCategories.has(member.categoryId)),
    categories
  );
}

export function featuredTeamMembers(members = [], categories = [], limit = 5) {
  const allMembers = publishedTeamMembers(members, categories);
  const featuredCategoryIds = new Set(
    published(categories)
      .filter((category) => category.featured)
      .map((category) => category.id)
  );
  const categoryMembers = featuredCategoryIds.size
    ? allMembers.filter((member) => featuredCategoryIds.has(member.categoryId))
    : allMembers;
  const featuredMembers = categoryMembers.filter((member) => member.featured);
  return (featuredMembers.length ? featuredMembers : categoryMembers).slice(0, limit);
}

export function groupedTeamMembers(members = [], categories = []) {
  const allMembers = publishedTeamMembers(members, categories);
  return published(categories)
    .map((category) => ({
      ...category,
      members: allMembers.filter((member) => member.categoryId === category.id)
    }))
    .filter((category) => category.members.length);
}

export function teamInitials(name) {
  return String(name || "Team")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
