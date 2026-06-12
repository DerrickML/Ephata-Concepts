import ButtonLink from "@/components/common/ButtonLink.jsx";
import ArchImage from "@/components/public/ArchImage.jsx";

export default function Hero({ settings }) {
  return (
    <section className="hero-section">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <h1 className="heading-serif">Graceful events. Calmly handled.</h1>
          <p>
            Planning, coordination, and guest experience support for weddings and
            professional gatherings.
          </p>
          <div className="button-row">
            <ButtonLink href="/book-consultation">Book a Consultation</ButtonLink>
            <ButtonLink href="/services" variant="secondary">
              Explore Our Services
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
            <strong>Opened beautifully.</strong>
            <span>Archway clarity. Staircase momentum.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
