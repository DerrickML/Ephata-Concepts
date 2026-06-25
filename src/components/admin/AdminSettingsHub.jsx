"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  Globe2,
  Home,
  Images,
  Info,
  ListChecks,
  Mail,
  MessageSquareQuote,
  Newspaper,
  Package,
  ServerCog,
  Share2,
  UsersRound
} from "lucide-react";
import AdminPageContentForm from "@/forms/AdminPageContentForm.jsx";
import AdminSettingsForm from "@/forms/AdminSettingsForm.jsx";
import AdminEmailSettingsForm from "./AdminEmailSettingsForm.jsx";
import AdminSocialLinksForm from "./AdminSocialLinksForm.jsx";

const contactFields = [
  { name: "heroTitle", label: "Hero Title" },
  { name: "heroIntro", label: "Hero Intro", type: "textarea", rows: 3 },
  { name: "primaryCtaLabel", label: "Primary CTA Label" },
  { name: "secondaryCtaLabel", label: "Secondary CTA Label" },
  { name: "responseTitle", label: "Side Note Title" },
  { name: "responseIntro", label: "Side Note Intro", type: "textarea", rows: 3 },
  {
    name: "noteItems",
    label: "Side Note Items",
    type: "list",
    rows: 4,
    help: "One item per line."
  },
  { name: "formTitle", label: "Form Title" },
  { name: "formIntro", label: "Form Intro", type: "textarea", rows: 3 },
  { name: "submitLabel", label: "Submit Button Label" }
];

const homeFields = [
  { name: "heroTitle", label: "Hero Title" },
  { name: "heroIntro", label: "Hero Intro", type: "textarea", rows: 3 },
  { name: "heroPrimaryLabel", label: "Hero Primary CTA Label" },
  { name: "heroPrimaryHref", label: "Hero Primary CTA Link" },
  { name: "heroSecondaryLabel", label: "Hero Secondary CTA Label" },
  { name: "heroSecondaryHref", label: "Hero Secondary CTA Link" },
  { name: "heroNoteTitle", label: "Hero Note Title" },
  { name: "heroNoteText", label: "Hero Note Text" },
  {
    name: "trustItems",
    label: "Trust Strip Labels",
    type: "list",
    rows: 4,
    help: "One short label per line."
  },
  { name: "aboutEyebrow", label: "About Eyebrow" },
  { name: "aboutTitle", label: "About Title" },
  { name: "aboutIntro", label: "About Intro", type: "textarea", rows: 3 },
  { name: "aboutBody", label: "About Side Copy", type: "textarea", rows: 3 },
  { name: "aboutLinkLabel", label: "About Link Label" },
  { name: "servicesEyebrow", label: "Services Eyebrow" },
  { name: "servicesTitle", label: "Services Title" },
  { name: "servicesIntro", label: "Services Intro", type: "textarea", rows: 3 },
  { name: "servicesLinkLabel", label: "Services Link Label" },
  { name: "processEyebrow", label: "Process Eyebrow" },
  { name: "processTitle", label: "Process Title" },
  { name: "processIntro", label: "Process Intro", type: "textarea", rows: 3 },
  {
    name: "processItems",
    label: "Process Steps",
    type: "prep-list",
    rows: 7,
    help: "One step per line using: Step Title | Description"
  },
  { name: "statisticsEyebrow", label: "Statistics Eyebrow" },
  { name: "statisticsTitle", label: "Statistics Title" },
  { name: "statisticsIntro", label: "Statistics Intro", type: "textarea", rows: 3 },
  {
    name: "statisticsItems",
    label: "Statistics",
    type: "stats-list",
    rows: 5,
    help: "One statistic per line using: 200+ | Events Managed | Short description"
  },
  { name: "packagesEyebrow", label: "Packages Eyebrow" },
  { name: "packagesTitle", label: "Packages Title" },
  { name: "packagesIntro", label: "Packages Intro", type: "textarea", rows: 3 },
  { name: "corporateEyebrow", label: "Corporate Eyebrow" },
  { name: "corporateTitle", label: "Corporate Title" },
  { name: "corporateIntro", label: "Corporate Intro", type: "textarea", rows: 3 },
  { name: "corporateLinkLabel", label: "Corporate Link Label" },
  { name: "portfolioEyebrow", label: "Portfolio Eyebrow" },
  { name: "portfolioTitle", label: "Portfolio Title" },
  { name: "portfolioIntro", label: "Portfolio Intro", type: "textarea", rows: 3 },
  { name: "testimonialsEyebrow", label: "Testimonials Eyebrow" },
  { name: "testimonialsTitle", label: "Testimonials Title" },
  { name: "testimonialsIntro", label: "Testimonials Intro", type: "textarea", rows: 3 },
  { name: "ctaEyebrow", label: "CTA Eyebrow" },
  { name: "ctaTitle", label: "CTA Title" },
  { name: "ctaBody", label: "CTA Body", type: "textarea", rows: 3 },
  { name: "ctaButtonLabel", label: "CTA Button Label" },
  { name: "ctaButtonHref", label: "CTA Button Link" }
];

const pageHeroFields = [
  { name: "pageLabel", label: "Page Label" },
  { name: "heroTitle", label: "Hero Title" },
  { name: "heroIntro", label: "Hero Intro", type: "textarea", rows: 3 }
];

const ctaFields = [
  { name: "ctaEyebrow", label: "CTA Eyebrow" },
  { name: "ctaTitle", label: "CTA Title" },
  { name: "ctaBody", label: "CTA Body", type: "textarea", rows: 3 },
  { name: "ctaButtonLabel", label: "CTA Button Label" },
  { name: "ctaButtonHref", label: "CTA Button Link" }
];

const emptyStateFields = [
  { name: "emptyTitle", label: "Empty State Title" },
  { name: "emptyMessage", label: "Empty State Message", type: "textarea", rows: 2 }
];

const aboutFields = [
  ...pageHeroFields,
  { name: "storyEyebrow", label: "Story Eyebrow" },
  { name: "storyTitle", label: "Story Title" },
  { name: "storyIntro", label: "Story Intro", type: "textarea", rows: 3 },
  { name: "storyBody", label: "Story Body", type: "textarea", rows: 3 },
  { name: "missionEyebrow", label: "Mission Eyebrow" },
  { name: "missionTitle", label: "Mission Title" },
  { name: "missionIntro", label: "Mission Intro", type: "textarea", rows: 3 },
  {
    name: "valuesItems",
    label: "Values",
    type: "prep-list",
    rows: 4,
    help: "One value per line using: Value Title | Description"
  },
  { name: "teamEyebrow", label: "Team Eyebrow" },
  { name: "teamTitle", label: "Team Title" },
  { name: "teamIntro", label: "Team Intro", type: "textarea", rows: 3 },
  ...ctaFields
];

const servicesFields = [
  ...pageHeroFields,
  { name: "categoryEyebrow", label: "Category Eyebrow" },
  { name: "categoryIntro", label: "Category Intro", type: "textarea", rows: 3 },
  ...emptyStateFields,
  { name: "detailSupportText", label: "Detail Page Support Text", type: "textarea", rows: 3 },
  { name: "detailPrimaryLabel", label: "Detail Primary Button Label" },
  { name: "detailPrimaryHref", label: "Detail Primary Button Link" },
  { name: "detailBackLabel", label: "Detail Back Button Label" },
  { name: "detailBackHref", label: "Detail Back Button Link" },
  { name: "fallbackRateLabel", label: "Fallback Rate Label" },
  ...ctaFields
];

const packagesFields = [
  ...pageHeroFields,
  { name: "categoryEyebrow", label: "Category Eyebrow" },
  { name: "categoryIntro", label: "Category Intro", type: "textarea", rows: 3 },
  ...emptyStateFields,
  ...ctaFields
];

const portfolioFields = [
  ...pageHeroFields,
  ...emptyStateFields,
  { name: "detailSupportText", label: "Detail Page Support Text", type: "textarea", rows: 3 },
  { name: "detailPrimaryLabel", label: "Detail Primary Button Label" },
  { name: "detailPrimaryHref", label: "Detail Primary Button Link" },
  ...ctaFields
];

const testimonialsFields = [
  ...pageHeroFields,
  ...emptyStateFields,
  ...ctaFields
];

const insightsFields = [
  ...pageHeroFields,
  ...emptyStateFields,
  { name: "relatedEyebrow", label: "Related Section Eyebrow" },
  { name: "relatedTitle", label: "Related Section Title" },
  { name: "relatedIntro", label: "Related Section Intro", type: "textarea", rows: 3 },
  ...ctaFields
];

const teamFields = [
  ...pageHeroFields,
  { name: "categoryEyebrow", label: "Category Eyebrow" },
  ...emptyStateFields,
  ...ctaFields
];

const consultationFields = [
  { name: "heroTitle", label: "Hero Title" },
  { name: "heroIntro", label: "Hero Intro", type: "textarea", rows: 3 },
  { name: "rhythmLabel", label: "Rhythm Label" },
  { name: "rhythmText", label: "Rhythm Text" },
  { name: "prepTitle", label: "Preparation Card Title" },
  {
    name: "prepItems",
    label: "Preparation Items",
    type: "prep-list",
    rows: 6,
    help: "One item per line using: Label | Description"
  },
  { name: "formTitle", label: "Form Title" },
  { name: "formIntro", label: "Form Intro", type: "textarea", rows: 3 },
  { name: "submitLabel", label: "Submit Button Label" }
];

function publicPageSection({ id, icon, title, description, meta, publicHref, fields }) {
  return {
    id,
    icon,
    title,
    eyebrow: "Public Page",
    description,
    meta,
    publicHref,
    content: (
      <AdminPageContentForm
        eyebrow="Public Page"
        title={title}
        description={description}
        endpoint={`/api/admin/public-pages/${id}`}
        publicHref={publicHref}
        fields={fields}
        embedded
      />
    )
  };
}

export default function AdminSettingsHub() {
  const sections = useMemo(
    () => [
      {
        id: "site",
        icon: Globe2,
        title: "Site Settings",
        eyebrow: "Global",
        description: "Brand identity, contact details, social links, logos, and public fallback visuals.",
        meta: "Used across header, footer, home, about, and contact details.",
        content: <AdminSettingsForm embedded />
      },
      {
        id: "socials",
        icon: Share2,
        title: "Social Links",
        eyebrow: "Public Presence",
        description: "Manage social profiles, visibility, display order, and the icon used for each platform.",
        meta: "Shown in the footer, contact page, and consultation page.",
        content: <AdminSocialLinksForm />
      },
      {
        id: "home",
        icon: Home,
        title: "Home Page",
        eyebrow: "Public Page",
        description: "Manage the homepage hero, section labels, process copy, statistics, and final CTA.",
        meta: "Controls / homepage copy, trust strip, statistics, and CTA.",
        publicHref: "/",
        content: (
          <AdminPageContentForm
            eyebrow="Public Page"
            title="Home Page"
            description="Manage the homepage copy, statistics, and section prompts."
            endpoint="/api/admin/home-page"
            publicHref="/"
            fields={homeFields}
            embedded
          />
        )
      },
      publicPageSection({
        id: "about",
        icon: Info,
        title: "About Page",
        description: "Manage the about hero, brand story, mission, values, team prompt, and CTA.",
        meta: "Controls /about page copy, values, and CTA.",
        publicHref: "/about",
        fields: aboutFields
      }),
      publicPageSection({
        id: "services",
        icon: ListChecks,
        title: "Services Page",
        description: "Manage the services hero, category helper copy, empty state, detail page helper text, and CTA.",
        meta: "Controls /services and service detail page wrapper copy.",
        publicHref: "/services",
        fields: servicesFields
      }),
      publicPageSection({
        id: "packages",
        icon: Package,
        title: "Packages Page",
        description: "Manage the packages hero, category helper copy, empty state, and CTA.",
        meta: "Controls /packages page wrapper copy and CTA.",
        publicHref: "/packages",
        fields: packagesFields
      }),
      publicPageSection({
        id: "portfolio",
        icon: Images,
        title: "Portfolio Page",
        description: "Manage the portfolio hero, empty state, detail page helper text, and CTA.",
        meta: "Controls /portfolio and portfolio detail page wrapper copy.",
        publicHref: "/portfolio",
        fields: portfolioFields
      }),
      publicPageSection({
        id: "testimonials",
        icon: MessageSquareQuote,
        title: "Testimonials Page",
        description: "Manage the testimonials hero, empty state, and CTA.",
        meta: "Controls /testimonials page copy and CTA.",
        publicHref: "/testimonials",
        fields: testimonialsFields
      }),
      publicPageSection({
        id: "insights",
        icon: Newspaper,
        title: "Insights Page",
        description: "Manage the insights hero, empty state, related insight labels, and CTA.",
        meta: "Controls /insights and insight detail related-section copy.",
        publicHref: "/insights",
        fields: insightsFields
      }),
      publicPageSection({
        id: "team",
        icon: UsersRound,
        title: "Team Page",
        description: "Manage the team hero, category helper label, empty state, and CTA.",
        meta: "Controls /team page copy and CTA.",
        publicHref: "/team",
        fields: teamFields
      }),
      {
        id: "email",
        icon: ServerCog,
        title: "Email Delivery",
        eyebrow: "System",
        description: "Configure SMTP, verification, account notifications, password recovery, and delivery retries.",
        meta: "Controls invitations, enquiry notifications, replies, and password reset codes.",
        content: <AdminEmailSettingsForm />
      },
      {
        id: "contact",
        icon: Mail,
        title: "Contact Page",
        eyebrow: "Public Page",
        description: "Manage direct contact page copy, CTA labels, side note content, and compact message form labels.",
        meta: "Feeds /contact and contact-source enquiry submissions.",
        publicHref: "/contact",
        content: (
          <AdminPageContentForm
            eyebrow="Public Page"
            title="Contact Page"
            description="Manage the standalone contact page copy and compact message form labels."
            endpoint="/api/admin/contact-page"
            publicHref="/contact"
            fields={contactFields}
            embedded
          />
        )
      },
      {
        id: "consultation",
        icon: CalendarCheck,
        title: "Consultation Page",
        eyebrow: "Public Page",
        description: "Manage booking page copy, the rhythm card, preparation prompts, and full request form labels.",
        meta: "Feeds /book-consultation and consultation-source enquiry submissions.",
        publicHref: "/book-consultation",
        content: (
          <AdminPageContentForm
            eyebrow="Public Page"
            title="Consultation Page"
            description="Manage the consultation page copy, rhythm card, preparation prompts, and full request form labels."
            endpoint="/api/admin/consultation-page"
            publicHref="/book-consultation"
            fields={consultationFields}
            embedded
          />
        )
      }
    ],
    []
  );
  const [activeId, setActiveId] = useState("site");

  useEffect(() => {
    const panel = new URLSearchParams(window.location.search).get("panel");
    if (sections.some((section) => section.id === panel)) {
      setActiveId(panel);
    }
  }, [sections]);

  function selectSection(id) {
    setActiveId(id);
    const nextUrl = id === "site" ? "/admin/settings" : `/admin/settings?panel=${id}`;
    window.history.replaceState(null, "", nextUrl);
  }

  const activeSection = sections.find((section) => section.id === activeId) || sections[0];
  const ActiveIcon = activeSection.icon;

  return (
    <section>
      <div className="admin-page-header settings-page-header">
        <p className="section-kicker">Settings</p>
        <h1>Site Control Center</h1>
        <p>Manage global configuration and public page settings from one place.</p>
      </div>

      <div className="settings-hub">
        <aside className="settings-nav-card" aria-label="Settings sections">
          {sections.map((section) => {
            const Icon = section.icon;
            const active = section.id === activeSection.id;
            return (
              <button
                type="button"
                className={active ? "settings-nav-item active" : "settings-nav-item"}
                key={section.id}
                onClick={() => selectSection(section.id)}
              >
                <span className="settings-nav-icon">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span>
                  <strong>{section.title}</strong>
                  <small>{section.meta}</small>
                </span>
              </button>
            );
          })}
        </aside>

        <div className="settings-workspace">
          <div className="settings-workspace-header">
            <span className="settings-workspace-icon">
              <ActiveIcon size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="section-kicker">{activeSection.eyebrow}</p>
              <h2>{activeSection.title}</h2>
              <p>{activeSection.description}</p>
            </div>
            {activeSection.publicHref ? (
              <a className="btn-admin secondary settings-public-link" href={activeSection.publicHref}>
                View Public Page
              </a>
            ) : null}
          </div>
          {activeSection.content}
        </div>
      </div>
    </section>
  );
}
