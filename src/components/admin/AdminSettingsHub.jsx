"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, Globe2, Mail, ServerCog, Share2 } from "lucide-react";
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
