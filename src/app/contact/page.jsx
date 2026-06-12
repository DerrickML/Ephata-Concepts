import { Mail, MapPin, Phone, Send, TimerReset } from "lucide-react";
import EnquiryForm from "@/forms/EnquiryForm.jsx";
import PageTransition from "@/components/common/PageTransition.jsx";
import ButtonLink from "@/components/common/ButtonLink.jsx";
import { readCollection } from "@/lib/jsonStore.js";
import SocialLinks from "@/components/public/SocialLinks.jsx";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact",
  description: "Contact Ephata Concepts for event planning and coordination in Uganda."
};

export default async function ContactPage() {
  const [settings, page] = await Promise.all([
    readCollection("settings"),
    readCollection("contactPage")
  ]);
  const phoneHref = `tel:${String(settings.phone || "").replace(/\s/g, "")}`;
  const contactMethods = [
    {
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
      icon: Mail
    },
    {
      label: "Phone",
      value: settings.phone,
      href: phoneHref,
      icon: Phone
    },
    {
      label: "Location",
      value: settings.location,
      href: null,
      icon: MapPin
    }
  ];

  return (
    <PageTransition>
      <section className="contact-hero">
        <div className="shell contact-hero-grid">
          <div className="contact-hero-copy">
            <h1 className="heading-serif">{page.heroTitle}</h1>
            <p>{page.heroIntro}</p>
            <div className="button-row">
              <a className="btn-brand" href={`mailto:${settings.email}`}>
                <span>{page.primaryCtaLabel}</span>
                <Send size={17} aria-hidden="true" />
              </a>
              <ButtonLink href="/book-consultation" variant="secondary">
                {page.secondaryCtaLabel}
              </ButtonLink>
            </div>
            <SocialLinks settings={settings} label="Connect with us" variant="contact" />
          </div>
          <div className="contact-method-stack" aria-label="Contact methods">
            {contactMethods.map(({ label, value, href, icon: Icon }) => (
              <div className="contact-method-card" key={label}>
                <span className="contact-method-icon">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <div>
                  <p>{label}</p>
                  {href ? <a href={href}>{value}</a> : <strong>{value}</strong>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad contact-note-band">
        <div className="shell contact-note-grid">
          <div className="contact-panel contact-response-card">
            <TimerReset size={26} aria-hidden="true" />
            <h2 className="heading-serif">{page.responseTitle}</h2>
            <p>{page.responseIntro}</p>
            <ul className="contact-mini-list">
              {(page.noteItems || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <EnquiryForm
            compact
            source="contact"
            title={page.formTitle}
            intro={page.formIntro}
            submitLabel={page.submitLabel}
          />
        </div>
      </section>
    </PageTransition>
  );
}
