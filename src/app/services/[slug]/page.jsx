import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import ButtonLink from "@/components/common/ButtonLink.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import ArchImage from "@/components/public/ArchImage.jsx";
import CTASection from "@/components/public/CTASection.jsx";
import PageTransition from "@/components/common/PageTransition.jsx";
import { publishedCategorizedItems } from "@/lib/contentCategories.js";
import { getItemBySlug, readCollection } from "@/lib/jsonStore.js";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getItemBySlug("services", slug);
  return {
    title: service?.title || "Service",
    description: service?.description
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const [rawService, categories, page] = await Promise.all([
    getItemBySlug("services", slug),
    readCollection("serviceCategories"),
    readCollection("servicesPage")
  ]);
  const service = rawService ? publishedCategorizedItems([rawService], categories)[0] : null;
  if (!service) notFound();

  return (
    <PageTransition>
      <PageHeader label={service.categoryName} title={service.title} intro={service.description} />
      <section className="section-pad">
        <div className="shell split-section">
          <div className="narrow-copy">
            <p className="price-line">{service.rate || page.fallbackRateLabel}</p>
            <p>{page.detailSupportText}</p>
            <div className="button-row">
              <ButtonLink href={page.detailPrimaryHref}>{page.detailPrimaryLabel}</ButtonLink>
              <ButtonLink href={page.detailBackHref} variant="secondary">
                {page.detailBackLabel}
              </ButtonLink>
            </div>
          </div>
          <ViewTransition name={`service-image-${service.id}`} share="morph">
            <ArchImage src={service.image} alt={service.title} />
          </ViewTransition>
        </div>
      </section>
      <CTASection
        eyebrow={page.ctaEyebrow}
        title={page.ctaTitle}
        body={page.ctaBody}
        buttonLabel={page.ctaButtonLabel}
        buttonHref={page.ctaButtonHref}
      />
    </PageTransition>
  );
}
