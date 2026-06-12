import {
  defaultColumns,
  contentCategoryFields,
  insightFields,
  packageFields,
  portfolioFields,
  serviceFields,
  teamCategoryFields,
  teamMemberFields,
  testimonialFields
} from "./adminFields.js";

export const adminCollectionConfig = {
  services: {
    collection: "services",
    path: "/admin/services",
    title: "Services",
    singularTitle: "Service",
    description: "Create and update service cards grouped by category.",
    fields: serviceFields,
    columns: defaultColumns.services
  },
  serviceCategories: {
    collection: "serviceCategories",
    apiPath: "/api/admin/service-categories",
    path: "/admin/services/categories",
    title: "Service Categories",
    singularTitle: "Service Category",
    description: "Create and order the categories available when managing services.",
    fields: contentCategoryFields,
    columns: defaultColumns.contentCategories
  },
  packages: {
    collection: "packages",
    path: "/admin/packages",
    title: "Packages",
    singularTitle: "Package",
    description: "Create and update packages grouped by category.",
    fields: packageFields,
    columns: defaultColumns.packages
  },
  packageCategories: {
    collection: "packageCategories",
    apiPath: "/api/admin/package-categories",
    path: "/admin/packages/categories",
    title: "Package Categories",
    singularTitle: "Package Category",
    description: "Create and order the categories available when managing packages.",
    fields: contentCategoryFields,
    columns: defaultColumns.contentCategories
  },
  portfolio: {
    collection: "portfolio",
    path: "/admin/portfolio",
    title: "Portfolio",
    singularTitle: "Portfolio Item",
    description: "Manage event work, gallery entries, featured flags, and publication state.",
    fields: portfolioFields,
    columns: defaultColumns.portfolio
  },
  portfolioCategories: {
    collection: "portfolioCategories",
    apiPath: "/api/admin/portfolio-categories",
    path: "/admin/portfolio/categories",
    title: "Portfolio Types",
    singularTitle: "Portfolio Type",
    description: "Create and order the event types available for portfolio work.",
    fields: contentCategoryFields,
    columns: defaultColumns.contentCategories
  },
  testimonials: {
    collection: "testimonials",
    path: "/admin/testimonials",
    title: "Testimonials",
    singularTitle: "Testimonial",
    description: "Manage client quotes, ratings, event roles, and featured testimonials.",
    fields: testimonialFields,
    columns: defaultColumns.testimonials
  },
  insights: {
    collection: "insights",
    path: "/admin/insights",
    title: "Insights",
    singularTitle: "Insight",
    description: "Manage categorized articles, tags, and publication status.",
    fields: insightFields,
    columns: defaultColumns.insights
  },
  insightCategories: {
    collection: "insightCategories",
    apiPath: "/api/admin/insight-categories",
    path: "/admin/insights/categories",
    title: "Insight Categories",
    singularTitle: "Insight Category",
    description: "Create and order the categories available when managing insights.",
    fields: contentCategoryFields,
    columns: defaultColumns.contentCategories
  },
  teamCategories: {
    collection: "teamCategories",
    apiPath: "/api/admin/team-categories",
    path: "/admin/team/categories",
    title: "Team Categories",
    singularTitle: "Team Category",
    description: "Create team groupings before assigning members to them.",
    fields: teamCategoryFields,
    columns: defaultColumns.teamCategories
  },
  teamMembers: {
    collection: "teamMembers",
    apiPath: "/api/admin/team-members",
    path: "/admin/team/members",
    title: "Team Members",
    singularTitle: "Team Member",
    description: "Manage the people shown on the About and Team pages.",
    fields: teamMemberFields,
    columns: defaultColumns.teamMembers
  }
};

export function getAdminCollectionConfig(collection) {
  const config = adminCollectionConfig[collection];
  if (!config) {
    throw new Error(`Unsupported admin collection: ${collection}`);
  }
  return config;
}
