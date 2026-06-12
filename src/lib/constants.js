export const SITE_NAME = "Ephata Concepts";

export const DEFAULT_SITE_TITLE =
  "Ephata Concepts | Event Planning and Coordination in Uganda";

export const DEFAULT_SITE_DESCRIPTION =
  "Ephata Concepts plans and coordinates elegant weddings, corporate events, retreats, and personal celebrations with precision, accountability, and peace of mind.";

export const COLLECTIONS = {
  services: { file: "services.json", type: "array" },
  serviceCategories: { file: "serviceCategories.json", type: "array" },
  packages: { file: "packages.json", type: "array" },
  packageCategories: { file: "packageCategories.json", type: "array" },
  portfolio: { file: "portfolio.json", type: "array" },
  portfolioCategories: { file: "portfolioCategories.json", type: "array" },
  testimonials: { file: "testimonials.json", type: "array" },
  insights: { file: "insights.json", type: "array" },
  insightCategories: { file: "insightCategories.json", type: "array" },
  teamCategories: { file: "teamCategories.json", type: "array" },
  teamMembers: { file: "teamMembers.json", type: "array" },
  enquiries: { file: "enquiries.json", type: "array" },
  users: { file: "users.json", type: "array" },
  accessProfiles: { file: "accessProfiles.json", type: "array" },
  sessions: { file: "sessions.json", type: "array" },
  auditLog: { file: "auditLog.json", type: "array" },
  emailOutbox: { file: "emailOutbox.json", type: "array" },
  passwordResetChallenges: { file: "passwordResetChallenges.json", type: "array" },
  accountInvitations: { file: "accountInvitations.json", type: "array" },
  enquiryMessages: { file: "enquiryMessages.json", type: "array" },
  settings: { file: "settings.json", type: "object" },
  emailSettings: { file: "emailSettings.json", type: "object" },
  contactPage: { file: "contactPage.json", type: "object" },
  consultationPage: { file: "consultationPage.json", type: "object" }
};

export const ARRAY_COLLECTIONS = Object.entries(COLLECTIONS)
  .filter(([, config]) => config.type === "array")
  .map(([name]) => name);

export const UPLOAD_FOLDERS = [
  "brand",
  "portfolio",
  "blog",
  "testimonials",
  "team",
  "services",
  "packages",
  "temp"
];

export const IMAGE_MIME_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/svg+xml": ".svg"
};

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const PUBLIC_NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Packages" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" }
];

export const ADMIN_NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", section: null },
  { href: "/admin/services", label: "Services", section: "services" },
  { href: "/admin/packages", label: "Packages", section: "packages" },
  { href: "/admin/portfolio", label: "Portfolio", section: "portfolio" },
  { href: "/admin/testimonials", label: "Testimonials", section: "testimonials" },
  { href: "/admin/insights", label: "Insights", section: "insights" },
  { href: "/admin/team", label: "Team", section: "team" },
  { href: "/admin/enquiries", label: "Enquiries", section: "enquiries" },
  { href: "/admin/settings", label: "Settings", section: "settings" },
  { href: "/admin/users", label: "Users", section: "users" }
];

export const EVENT_TYPES = [
  "Wedding",
  "Corporate Event",
  "Personal Celebration",
  "Retreat",
  "Conference",
  "Launch",
  "Professional Function",
  "Other"
];

export const DEFAULT_SETTINGS = {
  siteName: SITE_NAME,
  tagline: "Events planned with grace, precision, and peace of mind.",
  description: DEFAULT_SITE_DESCRIPTION,
  email: "hello@ephataconcepts.com",
  phone: "+256 700 000 000",
  location: "Kampala, Uganda",
  instagram: "",
  facebook: "",
  linkedin: "",
  socialLinks: [],
  socialLinksConfigured: false,
  logoPrimary: "brand/logo-primary.png",
  logoSecondary: "brand/logo-secondary.png",
  icon: "brand/icon.png",
  heroImage: "",
  aboutImage: "",
  corporateImage: ""
};

export const DEFAULT_CONTACT_PAGE = {
  heroTitle: "Reach the Ephata team.",
  heroIntro:
    "For quick questions, vendor coordination, or a first event note, use the channel that feels simplest.",
  primaryCtaLabel: "Email Us",
  secondaryCtaLabel: "Book a Call",
  responseTitle: "Short note. Clear next step.",
  responseIntro: "Send the essentials and we will route your message for admin review.",
  noteItems: [
    "Event or enquiry type",
    "Preferred contact channel",
    "What you need help with"
  ],
  formTitle: "Send a message",
  formIntro: "Keep it brief. We will follow up with the right next step.",
  submitLabel: "Send Message"
};

export const DEFAULT_CONSULTATION_PAGE = {
  heroTitle: "Plan a calmer first call.",
  heroIntro:
    "Share the shape of your event. We will review the details and respond with a clear consultation path.",
  rhythmLabel: "Consultation rhythm",
  rhythmText: "Listen. Clarify. Scope. Begin.",
  prepTitle: "Before we meet",
  prepItems: [
    { label: "Event scope", text: "Type, goals, and the support you need." },
    { label: "Guest picture", text: "Estimated count, flow, and hospitality needs." },
    { label: "Date and place", text: "Confirmed details or preferred windows." },
    { label: "First call", text: "A calm review of priorities and next steps." }
  ],
  formTitle: "Request consultation",
  formIntro: "The fuller brief helps us prepare a useful first response.",
  submitLabel: "Request Consultation"
};

export const DEFAULT_EMAIL_SETTINGS = {
  smtpHost: "",
  smtpPort: 587,
  smtpSecure: false,
  smtpUsername: "",
  smtpPasswordEncrypted: "",
  fromName: SITE_NAME,
  fromEmail: "",
  replyTo: "",
  enquiryNotificationsEnabled: true,
  accountInvitationsEnabled: true,
  passwordResetEnabled: false,
  verifiedFingerprint: "",
  lastVerifiedAt: null,
  lastVerificationError: ""
};

COLLECTIONS.settings.default = DEFAULT_SETTINGS;
COLLECTIONS.emailSettings.default = DEFAULT_EMAIL_SETTINGS;
COLLECTIONS.contactPage.default = DEFAULT_CONTACT_PAGE;
COLLECTIONS.consultationPage.default = DEFAULT_CONSULTATION_PAGE;
