import SectionHeader from "@/components/common/SectionHeader.jsx";
import Hero from "@/components/public/Hero.jsx";
import ServiceCard from "@/components/public/ServiceCard.jsx";
import PackageCard from "@/components/public/PackageCard.jsx";
import PortfolioCard from "@/components/public/PortfolioCard.jsx";
import TestimonialSlider from "@/components/public/TestimonialSlider.jsx";
import ProcessSteps from "@/components/public/ProcessSteps.jsx";
import CTASection from "@/components/public/CTASection.jsx";
import ArchImage from "@/components/public/ArchImage.jsx";
import PageTransition from "@/components/common/PageTransition.jsx";
import TransitionLink from "@/components/common/TransitionLink.jsx";
import { featured, published } from "@/lib/content.js";
import { publishedCategorizedItems } from "@/lib/contentCategories.js";
import { readCollection } from "@/lib/jsonStore.js";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [services, serviceCategories, packages, packageCategories, portfolio, portfolioCategories, testimonials, settings] = await Promise.all([
    readCollection("services"),
    readCollection("serviceCategories"),
    readCollection("packages"),
    readCollection("packageCategories"),
    readCollection("portfolio"),
    readCollection("portfolioCategories"),
    readCollection("testimonials"),
    readCollection("settings")
  ]);

  const visibleServices = publishedCategorizedItems(services, serviceCategories);
  const visiblePackages = publishedCategorizedItems(packages, packageCategories);
  const visiblePortfolio = publishedCategorizedItems(portfolio, portfolioCategories);
  const servicePreview = featured(visibleServices, 3);
  const packagePreview = featured(visiblePackages, 3);
  const portfolioPreview = featured(visiblePortfolio, 3);
  const publishedTestimonials = published(testimonials);
  const testimonialPreview = [
    ...publishedTestimonials.filter((item) => item.featured),
    ...publishedTestimonials.filter((item) => !item.featured)
  ].slice(0, 6);

  return (
    <PageTransition>
      <Hero settings={settings} />
      <section className="trust-strip">
        <div className="shell trust-grid">
          {["Weddings", "Corporate", "Retreats", "Celebrations"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="shell split-section">
          <SectionHeader
            eyebrow="About Ephata"
            title="Openings, elevated."
            intro="Ephata means “be opened”: a calm move into your next moment."
          />
          <div className="story-panel">
            <p>Archway for arrival. Staircase for elevation. Calm hands for the details.</p>
            <TransitionLink className="text-link" href="/about">
              About Ephata
            </TransitionLink>
          </div>
        </div>
      </section>

      <section className="section-pad muted-band">
        <div className="shell">
          <SectionHeader
            eyebrow="Services"
            title="Essential support."
            intro="Plan. Coordinate. Host. Reflect."
          />
          <div className="card-grid">
            {servicePreview.map((service) => (
              <ServiceCard service={service} key={service.id} />
            ))}
          </div>
          <TransitionLink className="text-link section-link" href="/services">
            All services
          </TransitionLink>
        </div>
      </section>

      <section className="section-pad process-band">
        <div className="shell">
          <SectionHeader
            eyebrow="Process"
            title="Five calm steps."
            intro="Clear enough to follow. Flexible enough for real events."
            align="right"
          />
          <ProcessSteps />
        </div>
      </section>

      <section className="section-pad">
        <div className="shell">
          <SectionHeader
            eyebrow="Packages"
            title="Simple starting points."
            intro="Choose a package, then tailor the scope."
          />
          <div className="card-grid">
            {packagePreview.map((item) => (
              <PackageCard item={item} key={item.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad corporate-band">
        <div className="shell split-section corporate-feature">
          <div className="corporate-copy">
            <SectionHeader
              eyebrow="Corporate"
              title="Professional gatherings, lightly held."
              intro="Launches, retreats, conferences, and team moments with clear flow."
            />
            <TransitionLink className="text-link" href="/packages">
              Corporate Packages
            </TransitionLink>
          </div>
          <ArchImage
            src={settings?.corporateImage}
            defaultSrc="/images/corporate-default.png"
            alt="Corporate panel event coordinated by Ephata Concepts"
          />
        </div>
      </section>

      <section className="section-pad navy-band">
        <div className="shell">
          <SectionHeader
            eyebrow="Portfolio"
            title="Recent moments."
            intro="A concise look at coordinated gatherings."
          />
          <div className="card-grid">
            {portfolioPreview.length ? (
              portfolioPreview.map((item) => (
                <PortfolioCard item={item} key={item.id} />
              ))
            ) : (
              published(visiblePortfolio)
                .slice(0, 3)
                .map((item) => (
                  <PortfolioCard item={item} key={item.id} />
                ))
            )}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="shell">
          <SectionHeader
            eyebrow="Client Words"
            title="Kind words."
            intro="Clients remember the calm."
            align="right"
          />
          <TestimonialSlider items={testimonialPreview} />
        </div>
      </section>

      <CTASection />
    </PageTransition>
  );
}
