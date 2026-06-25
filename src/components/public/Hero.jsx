import ButtonLink from "@/components/common/ButtonLink.jsx";
import ArchImage from "@/components/public/ArchImage.jsx";

export default function Hero({ settings, homePage }) {
  return (
    <section className="hero-section">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <h1 className="heading-serif">{homePage?.heroTitle || "Graceful events. Calmly handled."}</h1>
          <p>{homePage?.heroIntro || "Planning, coordination, and guest experience support for weddings and professional gatherings."}</p>
          <div className="button-row">
            <ButtonLink href={homePage?.heroPrimaryHref || "/book-consultation"}>
              {homePage?.heroPrimaryLabel || "Book a Consultation"}
            </ButtonLink>
            <ButtonLink href={homePage?.heroSecondaryHref || "/services"} variant="secondary">
              {homePage?.heroSecondaryLabel || "Explore Our Services"}
            </ButtonLink>
          </div>
        </div>
        <div className="hero-media">
          <ArchImage
            src={settings?.heroImage}
            defaultSrc="/images/hero-default.png"
            alt="Elegant event planning arch visual"
            priority
          />
          <div className="hero-note">
            <strong>{homePage?.heroNoteTitle || "Opened beautifully."}</strong>
            <span>{homePage?.heroNoteText || "Archway clarity. Staircase momentum."}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
