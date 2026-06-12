export const ARRAY_COLLECTION_TABLES = {
  accessProfiles: "access_profiles",
  users: "users",
  sessions: "sessions",
  serviceCategories: "service_categories",
  services: "services",
  packageCategories: "package_categories",
  packages: "packages",
  portfolioCategories: "portfolio_categories",
  portfolio: "portfolio",
  testimonials: "testimonials",
  insightCategories: "insight_categories",
  insights: "insights",
  teamCategories: "team_categories",
  teamMembers: "team_members",
  enquiries: "enquiries",
  enquiryMessages: "enquiry_messages",
  auditLog: "audit_log",
  emailOutbox: "email_outbox",
  passwordResetChallenges: "password_reset_challenges",
  accountInvitations: "account_invitations"
};

export const OBJECT_COLLECTIONS = new Set([
  "settings",
  "emailSettings",
  "contactPage",
  "consultationPage"
]);

export const IMPORT_ORDER = [
  "accessProfiles",
  "users",
  "sessions",
  "serviceCategories",
  "services",
  "packageCategories",
  "packages",
  "portfolioCategories",
  "portfolio",
  "testimonials",
  "insightCategories",
  "insights",
  "teamCategories",
  "teamMembers",
  "enquiries",
  "enquiryMessages",
  "auditLog",
  "emailOutbox",
  "passwordResetChallenges",
  "accountInvitations",
  "settings",
  "emailSettings",
  "contactPage",
  "consultationPage"
];

export function tableForCollection(name) {
  return ARRAY_COLLECTION_TABLES[name] || null;
}

export function indexedRecordFields(item = {}, position = 0) {
  return {
    slug: item.slug || null,
    categoryId: item.categoryId || null,
    parentId: item.enquiryId || null,
    userId: item.userId || null,
    accessProfileId: item.accessProfileId || null,
    email: item.email || null,
    username: item.username || null,
    tokenHash: item.tokenHash || null,
    status: item.status || null,
    sortOrder: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : null,
    published: typeof item.published === "boolean" ? item.published : null,
    position,
    createdAt: item.createdAt || null,
    updatedAt: item.updatedAt || null
  };
}
