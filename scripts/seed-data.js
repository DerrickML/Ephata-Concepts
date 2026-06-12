import { readCollection, writeCollection } from "../src/lib/jsonStore.js";
import { DEFAULT_SETTINGS } from "../src/lib/constants.js";
import { createUncategorizedCategory } from "../src/lib/contentCategories.js";

const force = process.argv.includes("--force");
const now = "2026-01-01T00:00:00.000Z";

function categoryRecords(definitions) {
  return [
    ...definitions.map(([id, name, description], index) => ({
    id,
    slug: id,
    name,
    description,
    published: true,
    sortOrder: index + 1,
    createdAt: now,
    updatedAt: now
    })),
    createUncategorizedCategory(now)
  ];
}

const serviceCategories = categoryRecords([
  ["event-planning-and-coordination", "Event Planning and Coordination", "End-to-end planning and calm event delivery."],
  ["content-creation", "Content Creation", "Programs and event content shaped around the brief."],
  ["speaker-and-panelist-coordination", "Speaker and Panelist Coordination", "Contributor sourcing, communication, and hospitality."],
  ["guest-coordination", "Guest Coordination", "Registration, seating, transport, and guest flow."],
  ["vendor-management", "Vendor Management", "Supplier sourcing, coordination, and accountability."],
  ["post-event-reporting-and-analytics", "Post-Event Reporting and Analytics", "Event insights, feedback, and operational learning."]
]);

const packageCategories = categoryRecords([
  ["wedding-planning-packages", "Wedding Planning Packages", "Planning options for intimate and expansive weddings."],
  ["corporate-event-planning-packages", "Corporate Event Planning Packages", "Structured support for professional gatherings."],
  ["additional-services", "Additional Services", "Focused add-ons for a wider event scope."],
  ["custom-packages", "Custom Packages", "Tailored planning built around a specific brief."],
  ["promotions", "Promotions", "Limited offers and consultation opportunities."]
]);

const portfolioCategories = categoryRecords([
  ["wedding", "Wedding", "Wedding planning and coordination work."],
  ["corporate-event", "Corporate Event", "Professional launches, functions, and programs."],
  ["retreat", "Retreat", "Team and leadership retreat experiences."]
]);

const insightCategories = categoryRecords([
  ["planning-guides", "Planning Guides", "Practical guidance for planning and coordinating events."],
  ["event-design", "Event Design", "Ideas on atmosphere, styling, and memorable event experiences."]
]);

const services = [
  {
    id: "full-event-planning",
    slug: "full-event-planning",
    title: "Full Event Planning",
    categoryId: "event-planning-and-coordination",
    description:
      "End-to-end planning, vendor coordination, logistics, and calm execution for weddings, corporate functions, and milestone celebrations.",
    rate: "Custom Quote",
    image: "",
    featured: true,
    published: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "event-day-coordination",
    slug: "event-day-coordination",
    title: "Event Day Coordination",
    categoryId: "event-planning-and-coordination",
    description:
      "A composed coordination team to manage the run sheet, vendors, guest flow, and timing while you stay present for the moment.",
    rate: "Custom Quote",
    image: "",
    featured: true,
    published: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "event-program-development",
    slug: "event-program-development",
    title: "Event Program Development",
    categoryId: "content-creation",
    description:
      "Thoughtful program structure, session flow, award moments, speaker notes, and event content aligned to your objectives.",
    rate: "Custom Quote",
    image: "",
    featured: true,
    published: true,
    sortOrder: 3,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "speaker-panelist-sourcing",
    slug: "speaker-panelist-sourcing",
    title: "Speaker and Panelist Sourcing",
    categoryId: "speaker-and-panelist-coordination",
    description:
      "Sourcing, communication, follow-up, screening, and hospitality support for speakers, panelists, and VIP contributors.",
    rate: "Custom Quote",
    image: "",
    featured: false,
    published: true,
    sortOrder: 4,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "guest-coordination",
    slug: "guest-coordination",
    title: "Guest Coordination",
    categoryId: "guest-coordination",
    description:
      "Registration, seating plans, transport coordination, guest identification, payment reconciliation, and professional ushering.",
    rate: "Custom Quote",
    image: "",
    featured: false,
    published: true,
    sortOrder: 5,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "vendor-management",
    slug: "vendor-management",
    title: "Vendor Management",
    categoryId: "vendor-management",
    description:
      "Venue sourcing, vendor contracting, coordination meetings, delivery checks, and on-site accountability for every supplier.",
    rate: "Custom Quote",
    image: "",
    featured: true,
    published: true,
    sortOrder: 6,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "post-event-reporting",
    slug: "post-event-reporting",
    title: "Post-Event Reporting and Analytics",
    categoryId: "post-event-reporting-and-analytics",
    description:
      "Event impact reports, vendor performance notes, and client feedback analysis to turn each event into operational learning.",
    rate: "Custom Quote",
    image: "",
    featured: false,
    published: true,
    sortOrder: 7,
    createdAt: now,
    updatedAt: now
  }
];

const packages = [
  {
    id: "wedding-basic",
    slug: "wedding-basic",
    name: "Basic Wedding Package",
    categoryId: "wedding-planning-packages",
    priceRange: "UGX 5,000,000 - UGX 10,000,000",
    description:
      "A focused planning package for couples who need professional guidance, vendor coordination, and a clear event timeline.",
    features: [
      "Event concept development",
      "Venue selection and coordination",
      "Vendor management",
      "Timeline creation and management"
    ],
    cta: "Book a Consultation",
    featured: true,
    published: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "wedding-premium",
    slug: "wedding-premium",
    name: "Premium Wedding Package",
    categoryId: "wedding-planning-packages",
    priceRange: "UGX 12,000,000 - UGX 25,000,000",
    description:
      "Comprehensive planning for couples who want a refined, closely managed wedding experience from concept to celebration.",
    features: [
      "Full planning calendar",
      "Design and vendor guidance",
      "Budget tracking",
      "Guest flow and event day leadership"
    ],
    cta: "Plan My Wedding",
    featured: true,
    published: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "luxury-wedding",
    slug: "luxury-wedding",
    name: "Luxury Wedding Package",
    categoryId: "wedding-planning-packages",
    priceRange: "Custom Quote",
    description:
      "High-touch planning and coordination for expansive wedding experiences with premium vendor teams and layered guest moments.",
    features: ["Bespoke concept design", "VIP guest handling", "Premium vendor coordination", "Full event execution team"],
    cta: "Request a Proposal",
    featured: false,
    published: true,
    sortOrder: 3,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "corporate-basic",
    slug: "corporate-basic",
    name: "Basic Corporate Package",
    categoryId: "corporate-event-planning-packages",
    priceRange: "Custom Quote",
    description:
      "Planning support for meetings, launches, trainings, and professional functions that need orderly delivery and clear reporting.",
    features: ["Venue coordination", "Run sheet development", "Vendor follow-up", "Guest registration support"],
    cta: "Book Corporate Support",
    featured: true,
    published: true,
    sortOrder: 4,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "corporate-retreat",
    slug: "corporate-retreat",
    name: "Corporate Retreat Package",
    categoryId: "corporate-event-planning-packages",
    priceRange: "Custom Quote",
    description:
      "Retreat planning for teams that need travel, venue, program, facilitation, and guest experience coordination in one calm process.",
    features: ["Destination support", "Program planning", "Transport and hospitality", "Post-event reporting"],
    cta: "Discuss a Retreat",
    featured: false,
    published: true,
    sortOrder: 5,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "event-design",
    slug: "event-design",
    name: "Event Design",
    categoryId: "additional-services",
    priceRange: "Custom Quote",
    description:
      "Concept, spatial direction, mood boards, and styling guidance for events that need a cohesive visual language.",
    features: ["Concept direction", "Color and material mood", "Layout guidance", "Vendor design brief"],
    cta: "Explore Design",
    featured: false,
    published: true,
    sortOrder: 6,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "dream-wedding",
    slug: "dream-wedding",
    name: "Dream Wedding",
    categoryId: "custom-packages",
    priceRange: "Custom Quote",
    description:
      "A tailored wedding planning path shaped around your guest count, culture, timeline, and desired level of support.",
    features: ["Custom scope", "Budget guidance", "Trusted vendor map", "Execution leadership"],
    cta: "Build My Package",
    featured: false,
    published: true,
    sortOrder: 7,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "free-consultation-offer",
    slug: "free-consultation-offer",
    name: "Free Consultation Offer",
    categoryId: "promotions",
    priceRange: "Free first consultation",
    description:
      "Begin with a calm discovery conversation so we can understand your moment, scope, timeline, and support needs.",
    features: ["Needs discovery", "Event priorities", "Initial scope direction", "Next-step recommendation"],
    cta: "Claim Consultation",
    featured: true,
    published: true,
    sortOrder: 8,
    createdAt: now,
    updatedAt: now
  }
];

const portfolio = [
  {
    id: "garden-wedding-kampala",
    slug: "garden-wedding-kampala",
    title: "Garden Wedding Coordination",
    categoryId: "wedding",
    location: "Kampala, Uganda",
    date: "2026",
    description:
      "A warm outdoor wedding concept with a calm guest journey, vendor timing, and a coordinated ceremony-to-reception transition.",
    coverImage: "",
    gallery: [],
    featured: true,
    published: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "leadership-retreat-entebbe",
    slug: "leadership-retreat-entebbe",
    title: "Leadership Retreat Program",
    categoryId: "retreat",
    location: "Entebbe, Uganda",
    date: "2026",
    description:
      "A structured leadership retreat with transport, session flow, hospitality, and post-event reflection aligned for an executive team.",
    coverImage: "",
    gallery: [],
    featured: true,
    published: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "corporate-launch-kampala",
    slug: "corporate-launch-kampala",
    title: "Corporate Launch Evening",
    categoryId: "corporate-event",
    location: "Kampala, Uganda",
    date: "2026",
    description:
      "A polished product launch experience combining program structure, VIP handling, registration, and vendor accountability.",
    coverImage: "",
    gallery: [],
    featured: false,
    published: true,
    sortOrder: 3,
    createdAt: now,
    updatedAt: now
  }
];

const testimonials = [
  {
    id: "miriam-and-daniel",
    clientName: "Miriam and Daniel",
    clientRole: "Wedding Clients",
    quote:
      "Ephata Concepts gave us the space to enjoy our day. Every detail felt cared for, and every vendor knew exactly what to do.",
    rating: 5,
    image: "",
    featured: true,
    published: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "corporate-programs-team",
    clientName: "Corporate Programs Team",
    clientRole: "Conference Client",
    quote:
      "The team brought structure, timing, and calm communication to a demanding professional event. Their accountability stood out.",
    rating: 5,
    image: "",
    featured: true,
    published: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "akello-family",
    clientName: "Akello Family",
    clientRole: "Personal Celebration",
    quote:
      "They listened carefully, guided the planning process, and helped us host a celebration that felt personal and beautifully organized.",
    rating: 5,
    image: "",
    featured: false,
    published: true,
    sortOrder: 3,
    createdAt: now,
    updatedAt: now
  }
];

const insights = [
  {
    id: "questions-before-booking-planner",
    slug: "questions-before-booking-planner",
    categoryId: "planning-guides",
    title: "Questions to Ask Before Booking an Event Planner",
    excerpt:
      "A calm planning process starts with the right questions about scope, communication, vendors, budget, and accountability.",
    body:
      "Before choosing an event planner, clarify what level of support you need. Ask how timelines are managed, how vendor decisions are documented, who leads on the event day, and how changes are handled. A strong planning partner should help you feel more organized, not more overwhelmed.",
    coverImage: "",
    author: "Ephata Concepts",
    publishedDate: "2026-01-15",
    tags: ["Planning", "Weddings", "Corporate Events"],
    featured: true,
    published: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "building-a-useful-event-timeline",
    slug: "building-a-useful-event-timeline",
    categoryId: "planning-guides",
    title: "How to Build an Event Timeline That Actually Works",
    excerpt:
      "A useful timeline is not just a list of activities. It is a coordination tool for guests, vendors, speakers, and decision makers.",
    body:
      "Start with immovable moments, then work backward through setup, arrivals, rehearsals, transitions, and vendor dependencies. Share the timeline early, review it with everyone responsible for delivery, and leave space for real-life movement between moments.",
    coverImage: "",
    author: "Ephata Concepts",
    publishedDate: "2026-02-02",
    tags: ["Timelines", "Coordination"],
    featured: false,
    published: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now
  }
];

const teamCategories = [
  {
    id: "management-team",
    slug: "management-team",
    name: "Management Team",
    description: "Core leadership for planning, coordination, and client experience.",
    featured: true,
    published: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "board-members",
    slug: "board-members",
    name: "Board Members",
    description: "Advisory support for strategy, governance, and long-term growth.",
    featured: false,
    published: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now
  },
  {
    ...createUncategorizedCategory(now),
    description: "Team members awaiting a category assignment."
  }
];

const teamMembers = [
  {
    id: "penelope-nagadya",
    slug: "penelope-nagadya",
    name: "Ms. Penelope Nagadya",
    role: "Co-founder",
    categoryId: "management-team",
    bio: "Leads client experience with calm structure from consultation to event day.",
    photo: "",
    featured: true,
    published: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "jackie-ahimbisibwe",
    slug: "jackie-ahimbisibwe",
    name: "Ms. Jackie Ahimbisibwe",
    role: "Co-founder",
    categoryId: "management-team",
    bio: "Guides planning details, vendor clarity, and graceful execution.",
    photo: "",
    featured: true,
    published: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now
  }
];

async function seedCollection(name, data) {
  const current = await readCollection(name);
  if (!force && Array.isArray(current) && current.length > 0) {
    console.log(`Skipped ${name}; existing data found. Use --force to overwrite.`);
    return;
  }
  await writeCollection(name, data);
  console.log(`Seeded ${name}: ${Array.isArray(data) ? data.length : 1} record(s).`);
}

async function main() {
  await seedCollection("serviceCategories", serviceCategories);
  await seedCollection("services", services);
  await seedCollection("packageCategories", packageCategories);
  await seedCollection("packages", packages);
  await seedCollection("portfolioCategories", portfolioCategories);
  await seedCollection("portfolio", portfolio);
  await seedCollection("testimonials", testimonials);
  await seedCollection("insightCategories", insightCategories);
  await seedCollection("insights", insights);
  await seedCollection("teamCategories", teamCategories);
  await seedCollection("teamMembers", teamMembers);

  const currentSettings = await readCollection("settings");
  if (force || !currentSettings.updatedAt) {
    await writeCollection("settings", {
      ...DEFAULT_SETTINGS,
      updatedAt: now
    });
    console.log("Seeded settings.");
  } else {
    console.log("Skipped settings; existing data found. Use --force to overwrite.");
  }

  const enquiries = await readCollection("enquiries");
  if (force && Array.isArray(enquiries)) {
    await writeCollection("enquiries", []);
    console.log("Reset enquiries.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
