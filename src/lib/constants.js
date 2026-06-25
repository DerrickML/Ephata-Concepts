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
  galleryAlbums: { file: "galleryAlbums.json", type: "array" },
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
  homePage: { file: "homePage.json", type: "object" },
  aboutPage: { file: "aboutPage.json", type: "object" },
  servicesPage: { file: "servicesPage.json", type: "object" },
  packagesPage: { file: "packagesPage.json", type: "object" },
  portfolioPage: { file: "portfolioPage.json", type: "object" },
  galleryPage: { file: "galleryPage.json", type: "object" },
  testimonialsPage: { file: "testimonialsPage.json", type: "object" },
  insightsPage: { file: "insightsPage.json", type: "object" },
  teamPage: { file: "teamPage.json", type: "object" },
  contactPage: { file: "contactPage.json", type: "object" },
  consultationPage: { file: "consultationPage.json", type: "object" }
};

export const ARRAY_COLLECTIONS = Object.entries(COLLECTIONS)
  .filter(([, config]) => config.type === "array")
  .map(([name]) => name);

export const UPLOAD_FOLDERS = [
  "brand",
  "portfolio",
  "gallery",
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
  { href: "/gallery", label: "Gallery" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" }
];

export const ADMIN_NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", section: null },
  { href: "/admin/services", label: "Services", section: "services" },
  { href: "/admin/packages", label: "Packages", section: "packages" },
  { href: "/admin/portfolio", label: "Portfolio", section: "portfolio" },
  { href: "/admin/gallery", label: "Gallery", section: "gallery" },
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

export const GALLERY_DISPLAY_STYLES = [
  { value: "uniform-grid", label: "Uniform Grid" },
  { value: "masonry", label: "Masonry" },
  { value: "mosaic", label: "Mosaic / Collage" },
  { value: "carousel", label: "Carousel" },
  { value: "infinite-scroll", label: "Infinite Scroll" },
  { value: "bento", label: "Bento Box" }
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

export const DEFAULT_HOME_PAGE = {
  heroTitle: "Graceful events. Calmly handled.",
  heroIntro:
    "Planning, coordination, and guest experience support for weddings and professional gatherings.",
  heroPrimaryLabel: "Book a Consultation",
  heroPrimaryHref: "/book-consultation",
  heroSecondaryLabel: "Explore Our Services",
  heroSecondaryHref: "/services",
  heroNoteTitle: "Opened beautifully.",
  heroNoteText: "Archway clarity. Staircase momentum.",
  trustItems: ["Weddings", "Corporate", "Retreats", "Celebrations"],
  aboutEyebrow: "About Ephata",
  aboutTitle: "Openings, elevated.",
  aboutIntro: 'Ephata means "be opened": a calm move into your next moment.',
  aboutBody: "Archway for arrival. Staircase for elevation. Calm hands for the details.",
  aboutLinkLabel: "About Ephata",
  servicesEyebrow: "Services",
  servicesTitle: "Essential support.",
  servicesIntro: "Plan. Coordinate. Host. Reflect.",
  servicesLinkLabel: "All services",
  processEyebrow: "Process",
  processTitle: "Five calm steps.",
  processIntro: "Clear enough to follow. Flexible enough for real events.",
  processItems: [
    { label: "Consultation", text: "Clarify the vision, define key milestones, and align on budget scope." },
    { label: "Concept", text: "Curate design themes, select aesthetics, and align brand style guides." },
    { label: "Planning", text: "Secure vendor contracts, manage details, and organize guest lists." },
    { label: "Execution", text: "Direct layout flows, verify timelines, and maintain a calm venue day." },
    { label: "Reflection", text: "Deliver final reporting, close finances, and review success metrics." }
  ],
  statisticsEyebrow: "Event Confidence",
  statisticsTitle: "Numbers with calm behind them.",
  statisticsIntro: "A quick view of the work, care, and coordination behind each gathering.",
  statisticsItems: [
    { value: "200+", label: "Events Managed", text: "Weddings, retreats, launches, and professional gatherings." },
    { value: "50+", label: "Vendor Partners", text: "Trusted teams coordinated around each event brief." },
    { value: "8+", label: "Years of Practice", text: "Planning rhythm built through real event delivery." }
  ],
  packagesEyebrow: "Packages",
  packagesTitle: "Simple starting points.",
  packagesIntro: "Choose a package, then tailor the scope.",
  corporateEyebrow: "Corporate",
  corporateTitle: "Professional gatherings, lightly held.",
  corporateIntro: "Launches, retreats, conferences, and team moments with clear flow.",
  corporateLinkLabel: "Corporate Packages",
  portfolioEyebrow: "Portfolio",
  portfolioTitle: "Recent moments.",
  portfolioIntro: "A concise look at coordinated gatherings.",
  testimonialsEyebrow: "Client Words",
  testimonialsTitle: "Kind words.",
  testimonialsIntro: "Clients remember the calm.",
  ctaEyebrow: "Book Consultation",
  ctaTitle: "Ready for a calmer event?",
  ctaBody: "Tell us what you are planning. We will shape the next step.",
  ctaButtonLabel: "Start",
  ctaButtonHref: "/book-consultation"
};

export const DEFAULT_ABOUT_PAGE = {
  pageLabel: "About",
  heroTitle: "A calm opening.",
  heroIntro: "Events held with grace, order, and care.",
  storyEyebrow: "Brand Story",
  storyTitle: 'Ephata means "be opened".',
  storyIntro: "An opening into a new stage. A staircase into what comes next.",
  storyBody: "We plan with warmth, structure, and a steady eye on the guest experience.",
  missionEyebrow: "Mission",
  missionTitle: "Clear. Accountable. Beautifully held.",
  missionIntro: "We protect the experience and keep decisions connected to the client's priorities.",
  valuesItems: [
    { label: "Excellence", text: "We plan with care, refine the details, and aim to get it right the first time." },
    { label: "Timely Delivery", text: "We respect time, timelines, and the flow of every event." },
    { label: "Accountability", text: "We take ownership of the process and communicate clearly from planning to execution." }
  ],
  teamEyebrow: "Team",
  teamTitle: "Steady hands.",
  teamIntro: "Meet the people shaping the calm behind each event.",
  ctaEyebrow: "Book Consultation",
  ctaTitle: "Ready for a calmer event?",
  ctaBody: "Tell us what you are planning. We will shape the next step.",
  ctaButtonLabel: "Start",
  ctaButtonHref: "/book-consultation"
};

export const DEFAULT_SERVICES_PAGE = {
  pageLabel: "Services",
  heroTitle: "Support that composes the day.",
  heroIntro: "Planning, coordination, guest flow, vendors, content, and reflection.",
  categoryEyebrow: "Service Category",
  categoryIntro: "Standalone support or part of a tailored package.",
  emptyTitle: "No services published yet",
  emptyMessage: "Services added in the admin panel will appear here.",
  detailSupportText: "Use it as focused support, or fold it into a wider planning package.",
  detailPrimaryLabel: "Book a Consultation",
  detailPrimaryHref: "/book-consultation",
  detailBackLabel: "Back to Services",
  detailBackHref: "/services",
  fallbackRateLabel: "Custom Quote",
  ctaEyebrow: "Book Consultation",
  ctaTitle: "Ready for a calmer event?",
  ctaBody: "Tell us what you are planning. We will shape the next step.",
  ctaButtonLabel: "Start",
  ctaButtonHref: "/book-consultation"
};

export const DEFAULT_PACKAGES_PAGE = {
  pageLabel: "Packages",
  heroTitle: "Packages with room to breathe.",
  heroIntro: "Start clear. Shape the scope after the consultation.",
  categoryEyebrow: "Package Group",
  categoryIntro: "Simple starting points. Flexible scope.",
  emptyTitle: "No packages published yet",
  emptyMessage: "",
  ctaEyebrow: "Book Consultation",
  ctaTitle: "Ready for a calmer event?",
  ctaBody: "Tell us what you are planning. We will shape the next step.",
  ctaButtonLabel: "Start",
  ctaButtonHref: "/book-consultation"
};

export const DEFAULT_PORTFOLIO_PAGE = {
  pageLabel: "Portfolio",
  heroTitle: "Quietly composed work.",
  heroIntro: "Weddings, gatherings, retreats, and professional moments.",
  emptyTitle: "No portfolio items published yet",
  emptyMessage: "",
  detailSupportText: "Planning structure, guest flow, vendor clarity, and a composed event day.",
  detailPrimaryLabel: "Plan a Similar Event",
  detailPrimaryHref: "/book-consultation",
  ctaEyebrow: "Book Consultation",
  ctaTitle: "Ready for a calmer event?",
  ctaBody: "Tell us what you are planning. We will shape the next step.",
  ctaButtonLabel: "Start",
  ctaButtonHref: "/book-consultation"
};

export const DEFAULT_GALLERY_PAGE = {
  pageLabel: "Gallery",
  heroTitle: "Albums with room to explore.",
  heroIntro: "Short previews from selected events, with links to the complete albums and video collections.",
  displayStyle: "bento",
  emptyTitle: "No gallery albums published yet",
  emptyMessage: "Albums added in the admin panel will appear here.",
  imageLimitNote: "Each album preview shows up to four images.",
  externalLinkLabel: "Open Full Album",
  videoLinkLabel: "Watch Video",
  ctaEyebrow: "Book Consultation",
  ctaTitle: "Ready for a calmer event?",
  ctaBody: "Tell us what you are planning. We will shape the next step.",
  ctaButtonLabel: "Start",
  ctaButtonHref: "/book-consultation"
};

export const DEFAULT_TESTIMONIALS_PAGE = {
  pageLabel: "Testimonials",
  heroTitle: "Clients remember the calm.",
  heroIntro: "Short notes from people who trusted us with the details.",
  emptyTitle: "No testimonials published yet",
  emptyMessage: "",
  ctaEyebrow: "Book Consultation",
  ctaTitle: "Ready for a calmer event?",
  ctaBody: "Tell us what you are planning. We will shape the next step.",
  ctaButtonLabel: "Start",
  ctaButtonHref: "/book-consultation"
};

export const DEFAULT_INSIGHTS_PAGE = {
  pageLabel: "Insights",
  heroTitle: "Notes for calmer events.",
  heroIntro: "Practical planning guidance, kept brief.",
  emptyTitle: "No insights published yet",
  emptyMessage: "",
  relatedEyebrow: "Continue Reading",
  relatedTitle: "Related insights.",
  relatedIntro: "Selected by shared topics and category.",
  ctaEyebrow: "Book Consultation",
  ctaTitle: "Ready for a calmer event?",
  ctaBody: "Tell us what you are planning. We will shape the next step.",
  ctaButtonLabel: "Start",
  ctaButtonHref: "/book-consultation"
};

export const DEFAULT_TEAM_PAGE = {
  pageLabel: "Team",
  heroTitle: "People behind the calm.",
  heroIntro: "A focused team for planning, coordination, and guest experience.",
  categoryEyebrow: "Team Category",
  emptyTitle: "Team details are coming soon.",
  emptyMessage: "Check back for the full Ephata Concepts team.",
  ctaEyebrow: "Book Consultation",
  ctaTitle: "Ready for a calmer event?",
  ctaBody: "Tell us what you are planning. We will shape the next step.",
  ctaButtonLabel: "Start",
  ctaButtonHref: "/book-consultation"
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
COLLECTIONS.homePage.default = DEFAULT_HOME_PAGE;
COLLECTIONS.aboutPage.default = DEFAULT_ABOUT_PAGE;
COLLECTIONS.servicesPage.default = DEFAULT_SERVICES_PAGE;
COLLECTIONS.packagesPage.default = DEFAULT_PACKAGES_PAGE;
COLLECTIONS.portfolioPage.default = DEFAULT_PORTFOLIO_PAGE;
COLLECTIONS.galleryPage.default = DEFAULT_GALLERY_PAGE;
COLLECTIONS.testimonialsPage.default = DEFAULT_TESTIMONIALS_PAGE;
COLLECTIONS.insightsPage.default = DEFAULT_INSIGHTS_PAGE;
COLLECTIONS.teamPage.default = DEFAULT_TEAM_PAGE;
COLLECTIONS.contactPage.default = DEFAULT_CONTACT_PAGE;
COLLECTIONS.consultationPage.default = DEFAULT_CONSULTATION_PAGE;
