import { CalendarCheck, ClipboardList, MapPinned, UsersRound } from "lucide-react";
import EnquiryForm from "@/forms/EnquiryForm.jsx";
import PageTransition from "@/components/common/PageTransition.jsx";
import { readCollection } from "@/lib/jsonStore.js";
import SocialLinks from "@/components/public/SocialLinks.jsx";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Book Consultation",
  description:
    "Book a consultation with Ephata Concepts for weddings, corporate events, retreats, conferences, and special functions."
};

const prepIcons = [ClipboardList, UsersRound, MapPinned, CalendarCheck];

export default async function BookConsultationPage() {
  const [page, settings] = await Promise.all([
    readCollection("consultationPage"),
    readCollection("settings")
  ]);
  const planningNotes = (page.prepItems || []).map((item, index) => ({
    ...item,
    icon: prepIcons[index % prepIcons.length]
  }));

  return (
    <PageTransition>
      <section className="booking-hero">
        <div className="shell booking-hero-grid">
          <div className="booking-hero-copy">
            <h1 className="heading-serif">{page.heroTitle}</h1>
            <p>{page.heroIntro}</p>
            <SocialLinks settings={settings} label="Find us online" variant="inverse" />
          </div>
          <div className="booking-visual-card">
            <span>{page.rhythmLabel}</span>
            <strong>{page.rhythmText}</strong>
          </div>
        </div>
      </section>

      <section className="section-pad consultation-band">
        <div className="shell booking-workspace">
          <aside className="consultation-note booking-prep-card">
            <h2 className="heading-serif">{page.prepTitle}</h2>
            <div className="booking-step-list">
              {planningNotes.map(({ label, text, icon: Icon }) => (
                <div className="booking-step" key={label}>
                  <span>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{label}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
          <div className="booking-form-panel">
            <EnquiryForm
              source="consultation"
              title={page.formTitle}
              intro={page.formIntro}
              submitLabel={page.submitLabel}
            />
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
