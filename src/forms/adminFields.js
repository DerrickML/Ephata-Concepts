import { categoryOptions } from "@/lib/contentCategories.js";

export function serviceFields(categories = []) {
  return [
  { name: "title", label: "Title", required: true },
  { name: "slug", label: "Slug", help: "Leave blank to generate from title." },
  { name: "categoryId", label: "Category", type: "select", options: categoryOptions(categories), help: "Create service categories first, then assign one here.", required: true },
  { name: "description", label: "Description", type: "textarea", rows: 5, required: true },
  { name: "rate", label: "Rate text", defaultValue: "Custom Quote" },
  { name: "image", label: "Image or URL", type: "image", folder: "services" },
  { name: "featured", label: "Featured", type: "checkbox" },
  { name: "published", label: "Published", type: "checkbox", defaultValue: true },
  { name: "sortOrder", label: "Sort order", type: "number", defaultValue: 999 }
  ];
}

export function packageFields(categories = []) {
  return [
  { name: "name", label: "Name", required: true },
  { name: "slug", label: "Slug", help: "Leave blank to generate from name." },
  { name: "categoryId", label: "Category", type: "select", options: categoryOptions(categories), help: "Create package categories first, then assign one here.", required: true },
  { name: "priceRange", label: "Price range" },
  { name: "description", label: "Description", type: "textarea", rows: 5, required: true },
  { name: "features", label: "Features", type: "textarea", rows: 5, help: "One feature per line." },
  { name: "cta", label: "CTA", defaultValue: "Book a Consultation" },
  { name: "image", label: "Image or URL", type: "image", folder: "packages" },
  { name: "featured", label: "Featured", type: "checkbox" },
  { name: "published", label: "Published", type: "checkbox", defaultValue: true },
  { name: "sortOrder", label: "Sort order", type: "number", defaultValue: 999 }
  ];
}

export function portfolioFields(categories = []) {
  return [
  { name: "title", label: "Title", required: true },
  { name: "slug", label: "Slug", help: "Leave blank to generate from title." },
  { name: "categoryId", label: "Portfolio type", type: "select", options: categoryOptions(categories), help: "Create portfolio types first, then assign one here.", required: true },
  { name: "location", label: "Location" },
  { name: "date", label: "Date or year" },
  { name: "description", label: "Description", type: "textarea", rows: 5 },
  { name: "coverImage", label: "Cover image or URL", type: "image", folder: "portfolio" },
  {
    name: "gallery",
    label: "Gallery images or URLs",
    type: "textarea",
    rows: 4,
    help: "One uploaded path, /images/... path, or image URL per line."
  },
  { name: "featured", label: "Featured", type: "checkbox" },
  { name: "published", label: "Published", type: "checkbox", defaultValue: true },
  { name: "sortOrder", label: "Sort order", type: "number", defaultValue: 999 }
  ];
}

export const galleryAlbumFields = [
  { name: "title", label: "Album title", required: true },
  { name: "slug", label: "Slug", help: "Leave blank to generate from title." },
  { name: "description", label: "Description", type: "textarea", rows: 4 },
  { name: "eventDate", label: "Date or year" },
  { name: "location", label: "Location" },
  {
    name: "images",
    label: "Preview images",
    type: "multiimage",
    folder: "gallery",
    maxImages: 4,
    help: "Upload or paste up to four preview images. The full album should live at the external album link."
  },
  { name: "externalAlbumUrl", label: "Full album link", type: "url", required: true },
  {
    name: "videoLinks",
    label: "Video links",
    type: "textarea",
    rows: 4,
    help: "One video URL per line. Videos are linked externally rather than uploaded."
  },
  { name: "featured", label: "Featured", type: "checkbox" },
  { name: "published", label: "Published", type: "checkbox", defaultValue: true },
  { name: "sortOrder", label: "Sort order", type: "number", defaultValue: 999 }
];

export const testimonialFields = [
  { name: "clientName", label: "Client name", required: true },
  { name: "clientRole", label: "Client role or event type" },
  { name: "quote", label: "Quote", type: "textarea", rows: 5, required: true },
  { name: "rating", label: "Rating", type: "number", defaultValue: 5 },
  { name: "image", label: "Client image or URL", type: "image", folder: "testimonials" },
  { name: "featured", label: "Featured", type: "checkbox" },
  { name: "published", label: "Published", type: "checkbox", defaultValue: true },
  { name: "sortOrder", label: "Sort order", type: "number", defaultValue: 999 }
];

export function insightFields(categories = []) {
  return [
  { name: "title", label: "Title", required: true },
  { name: "slug", label: "Slug", help: "Leave blank to generate from title." },
  { name: "categoryId", label: "Category", type: "select", options: categoryOptions(categories), help: "Create insight categories first, then assign one here.", required: true },
  { name: "excerpt", label: "Excerpt", type: "textarea", rows: 3, required: true },
  {
    name: "body",
    label: "Body",
    type: "richtext",
    required: true,
    placeholder: "Write the article body with headings, lists, quotes, and links.",
    help: "Use headings, lists, quotes, and links where they help the article scan better."
  },
  { name: "coverImage", label: "Cover image or URL", type: "image", folder: "blog" },
  { name: "author", label: "Author", defaultValue: "Ephata Concepts" },
  { name: "publishedDate", label: "Published date", type: "date" },
  { name: "tags", label: "Tags", type: "textarea", rows: 3, help: "Comma-separated or one per line." },
  { name: "featured", label: "Featured", type: "checkbox" },
  { name: "published", label: "Published", type: "checkbox", defaultValue: true },
  { name: "sortOrder", label: "Sort order", type: "number", defaultValue: 999 }
  ];
}

export const teamCategoryFields = [
  { name: "name", label: "Name", required: true },
  { name: "slug", label: "Slug", help: "Leave blank to generate from name." },
  { name: "description", label: "Description", type: "textarea", rows: 4 },
  { name: "featured", label: "Featured on About page", type: "checkbox" },
  { name: "published", label: "Published", type: "checkbox", defaultValue: true },
  { name: "sortOrder", label: "Sort order", type: "number", defaultValue: 999 }
];

export const contentCategoryFields = [
  { name: "name", label: "Name", required: true },
  { name: "slug", label: "Slug", help: "Leave blank to generate from name." },
  { name: "description", label: "Description", type: "textarea", rows: 4 },
  { name: "published", label: "Published", type: "checkbox", defaultValue: true },
  { name: "sortOrder", label: "Sort order", type: "number", defaultValue: 999 }
];

export function teamMemberFields(categories = []) {
  return [
    { name: "name", label: "Name", required: true },
    { name: "slug", label: "Slug", help: "Leave blank to generate from name." },
    { name: "role", label: "Role", required: true },
    {
      name: "categoryId",
      label: "Category",
      type: "select",
      options: categories.map((category) => ({ label: category.name, value: category.id })),
      help: "Create categories first, then assign each member here.",
      required: true
    },
    { name: "bio", label: "Bio", type: "textarea", rows: 5 },
    { name: "photo", label: "Photo or URL", type: "image", folder: "team" },
    { name: "featured", label: "Featured on About page", type: "checkbox" },
    { name: "published", label: "Published", type: "checkbox", defaultValue: true },
    { name: "sortOrder", label: "Sort order", type: "number", defaultValue: 999 }
  ];
}

export const defaultColumns = {
  services: [
    { key: "title", label: "Title" },
    { key: "categoryName", label: "Category" },
    { key: "rate", label: "Rate" }
  ],
  packages: [
    { key: "name", label: "Name" },
    { key: "categoryName", label: "Category" },
    { key: "priceRange", label: "Price range" }
  ],
  portfolio: [
    { key: "title", label: "Title" },
    { key: "categoryName", label: "Type" },
    { key: "location", label: "Location" }
  ],
  galleryAlbums: [
    { key: "title", label: "Album" },
    { key: "location", label: "Location" },
    { key: "imageCount", label: "Images" },
    { key: "videoCount", label: "Videos" }
  ],
  testimonials: [
    { key: "clientName", label: "Client" },
    { key: "clientRole", label: "Role" },
    { key: "rating", label: "Rating" }
  ],
  insights: [
    { key: "title", label: "Title" },
    { key: "categoryName", label: "Category" },
    { key: "author", label: "Author" },
    { key: "publishedDate", label: "Date" }
  ],
  teamCategories: [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" }
  ],
  contentCategories: [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "sortOrder", label: "Order" }
  ],
  teamMembers: [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "categoryName", label: "Category" }
  ]
};
