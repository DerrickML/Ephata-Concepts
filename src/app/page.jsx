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
  const [services, serviceCategories, packages, packageCategories, portfolio, portfolioCategories, testimonials, settings, homePage] = await Promise.all([
    readCollection("services"),
    readCollection("serviceCategories"),
    readCollection("packages"),
    readCollection("packageCategories"),
    readCollection("portfolio"),
    readCollection("portfolioCategories"),
    readCollection("testimonials"),
    readCollection("settings"),
    readCollection("homePage")
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

  const trustItems = Array.isArray(homePage.trustItems) && homePage.trustItems.length
    ? homePage.trustItems
    : ["Weddings", "Corporate", "Retreats", "Celebrations"];
  const statisticsItems = Array.isArray(homePage.statisticsItems) ? homePage.statisticsItems : [];

  return (
    <PageTransition>
      <Hero settings={settings} homePage={homePage} />
      <section className="trust-strip">
        <div className="shell trust-grid">
          {trustItems.map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="shell split-section">
          <SectionHeader
            eyebrow={homePage.aboutEyebrow}
            title={homePage.aboutTitle}
            intro={homePage.aboutIntro}
          />
          <div className="story-panel">
            <p>{homePage.aboutBody}</p>
            <TransitionLink className="text-link" href="/about">
              {homePage.aboutLinkLabel}
            </TransitionLink>
          </div>
        </div>
      </section>

      {statisticsItems.length ? (
        <section className="section-pad stats-band">
          <div className="shell">
            <SectionHeader
              eyebrow={homePage.statisticsEyebrow}
              title={homePage.statisticsTitle}
              intro={homePage.statisticsIntro}
            />
            <div className="stats-grid">
              {statisticsItems.map((item, index) => (
                <article className="stat-card" key={`${item.value}-${item.label}-${index}`}>
                  <strong>{item.value}</strong>
                  <h3>{item.label}</h3>
                  {item.text ? <p>{item.text}</p> : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-pad muted-band">
        <div className="shell">
          <SectionHeader
            eyebrow={homePage.servicesEyebrow}
            title={homePage.servicesTitle}
            intro={homePage.servicesIntro}
          />
          <div className="card-grid">
            {servicePreview.map((service) => (
              <ServiceCard service={service} key={service.id} />
            ))}
          </div>
          <TransitionLink className="text-link section-link" href="/services">
            {homePage.servicesLinkLabel}
          </TransitionLink>
        </div>
      </section>

      <section className="section-pad process-band">
        <div className="shell">
          <SectionHeader
            eyebrow={homePage.processEyebrow}
            title={homePage.processTitle}
            intro={homePage.processIntro}
            align="right"
          />
          <ProcessSteps items={homePage.processItems} />
        </div>
      </section>

      <section className="section-pad">
        <div className="shell">
          <SectionHeader
            eyebrow={homePage.packagesEyebrow}
            title={homePage.packagesTitle}
            intro={homePage.packagesIntro}
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
              eyebrow={homePage.corporateEyebrow}
              title={homePage.corporateTitle}
              intro={homePage.corporateIntro}
            />
            <TransitionLink className="text-link" href="/packages">
              {homePage.corporateLinkLabel}
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
            eyebrow={homePage.portfolioEyebrow}
            title={homePage.portfolioTitle}
            intro={homePage.portfolioIntro}
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
            eyebrow={homePage.testimonialsEyebrow}
            title={homePage.testimonialsTitle}
            intro={homePage.testimonialsIntro}
            align="right"
          />
          <TestimonialSlider items={testimonialPreview} />
        </div>
      </section>

      <CTASection
        eyebrow={homePage.ctaEyebrow}
        title={homePage.ctaTitle}
        body={homePage.ctaBody}
        buttonLabel={homePage.ctaButtonLabel}
        buttonHref={homePage.ctaButtonHref}
      />
    </PageTransition>
  );
}
