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
  const rawService = await getItemBySlug("services", slug);
  const categories = await readCollection("serviceCategories");
  const service = rawService ? publishedCategorizedItems([rawService], categories)[0] : null;
  if (!service) notFound();

  return (
    <PageTransition>
      <PageHeader label={service.categoryName} title={service.title} intro={service.description} />
      <section className="section-pad">
        <div className="shell split-section">
          <div className="narrow-copy">
            <p className="price-line">{service.rate || "Custom Quote"}</p>
            <p>Use it as focused support, or fold it into a wider planning package.</p>
            <div className="button-row">
              <ButtonLink href="/book-consultation">Book a Consultation</ButtonLink>
              <ButtonLink href="/services" variant="secondary">
                Back to Services
              </ButtonLink>
            </div>
          </div>
          <ViewTransition name={`service-image-${service.id}`} share="morph">
            <ArchImage src={service.image} alt={service.title} />
          </ViewTransition>
        </div>
      </section>
      <CTASection />
    </PageTransition>
  );
}
