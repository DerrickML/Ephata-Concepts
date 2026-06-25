export const ADMIN_SECTIONS = [
  { key: "services", label: "Services", actions: ["view", "create", "edit", "delete"] },
  { key: "packages", label: "Packages", actions: ["view", "create", "edit", "delete"] },
  { key: "portfolio", label: "Portfolio", actions: ["view", "create", "edit", "delete"] },
  { key: "testimonials", label: "Testimonials", actions: ["view", "create", "edit", "delete"] },
  { key: "insights", label: "Insights", actions: ["view", "create", "edit", "delete"] },
  { key: "team", label: "Team", actions: ["view", "create", "edit", "delete"] },
  { key: "enquiries", label: "Enquiries", actions: ["view", "edit", "delete"] },
  { key: "settings", label: "Settings", actions: ["view", "edit"] },
  { key: "users", label: "Users", actions: ["view", "create", "edit", "delete", "manage"] }
];

export const SECTION_KEYS = ADMIN_SECTIONS.map((section) => section.key);

export const COLLECTION_SECTION = {
  services: "services",
  serviceCategories: "services",
  packages: "packages",
  packageCategories: "packages",
  portfolio: "portfolio",
  portfolioCategories: "portfolio",
  testimonials: "testimonials",
  insights: "insights",
  insightCategories: "insights",
  teamCategories: "team",
  teamMembers: "team",
  enquiries: "enquiries",
  settings: "settings",
  homePage: "settings",
  contactPage: "settings",
  consultationPage: "settings",
  users: "users",
  accessProfiles: "users",
  auditLog: "users"
};

export const ACCESS_LEVELS = {
  none: [],
  view: ["view"],
  contributor: ["view", "create", "edit"],
  manager: ["view", "create", "edit", "delete"]
};

export function emptyPermissions() {
  return Object.fromEntries(ADMIN_SECTIONS.map((section) => [section.key, []]));
}

export function fullPermissions() {
  return Object.fromEntries(ADMIN_SECTIONS.map((section) => [section.key, [...section.actions]]));
}

export function sanitizePermissions(input = {}) {
  return Object.fromEntries(
    ADMIN_SECTIONS.map((section) => {
      const allowed = new Set(section.actions);
      const values = Array.isArray(input[section.key]) ? input[section.key] : [];
      return [section.key, [...new Set(values.filter((action) => allowed.has(action)))]];
    })
  );
}

export function sanitizeOverrides(input = {}) {
  return Object.fromEntries(
    ADMIN_SECTIONS.map((section) => {
      const allowed = new Set(section.actions);
      const value = input[section.key] || {};
      return [section.key, {
        allow: [...new Set((Array.isArray(value.allow) ? value.allow : []).filter((action) => allowed.has(action)))],
        deny: [...new Set((Array.isArray(value.deny) ? value.deny : []).filter((action) => allowed.has(action)))]
      }];
    })
  );
}

export function resolvePermissions(profilePermissions = {}, overrides = {}) {
  const base = sanitizePermissions(profilePermissions);
  const normalizedOverrides = sanitizeOverrides(overrides);
  return Object.fromEntries(
    ADMIN_SECTIONS.map((section) => {
      const actions = new Set(base[section.key]);
      for (const action of normalizedOverrides[section.key].deny) actions.delete(action);
      for (const action of normalizedOverrides[section.key].allow) actions.add(action);
      return [section.key, section.actions.filter((action) => actions.has(action))];
    })
  );
}

export function hasPermission(subject, section, action = "view") {
  return Boolean(subject?.permissions?.[section]?.includes(action));
}

export function canManageUsers(subject) {
  return hasPermission(subject, "users", "manage");
}

export function canGrantPermissions(subject, requestedPermissions = {}) {
  if (subject?.isSystemOwner) return true;
  return ADMIN_SECTIONS.every((section) =>
    (requestedPermissions[section.key] || []).every((action) => hasPermission(subject, section.key, action))
  );
}

export function permissionLevel(actions = [], sectionKey) {
  const section = ADMIN_SECTIONS.find((entry) => entry.key === sectionKey);
  const normalized = section ? section.actions.filter((action) => actions.includes(action)) : [];
  if (!normalized.length) return "none";
  if (normalized.length === 1 && normalized[0] === "view") return "view";
  const managerActions = (section?.actions || []).filter((action) => action !== "manage");
  if (managerActions.every((action) => normalized.includes(action))) return "manager";
  if (["view", "create", "edit"].every((action) => normalized.includes(action))) return "contributor";
  return "custom";
}
