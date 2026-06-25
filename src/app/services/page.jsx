import { ViewTransition } from "react";
import EmptyState from "@/components/common/EmptyState.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import SectionHeader from "@/components/common/SectionHeader.jsx";
import ServiceCard from "@/components/public/ServiceCard.jsx";
import CTASection from "@/components/public/CTASection.jsx";
import PageTransition from "@/components/common/PageTransition.jsx";
import { groupedCategorizedItems } from "@/lib/contentCategories.js";
import { readCollection } from "@/lib/jsonStore.js";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await readCollection("servicesPage");
  return {
    title: page.pageLabel || "Services",
    description: page.heroIntro
  };
}

export default async function ServicesPage() {
  const [services, categories, page] = await Promise.all([
    readCollection("services"),
    readCollection("serviceCategories"),
    readCollection("servicesPage")
  ]);
  const groups = groupedCategorizedItems(services, categories);

  return (
    <PageTransition>
      <PageHeader
        label={page.pageLabel}
        title={page.heroTitle}
        intro={page.heroIntro}
      />
      <section className="section-pad">
        <div className="shell">
          {groups.length ? (
            groups.map((category) => (
                <div className="category-block" key={category.id}>
                  <SectionHeader
                    eyebrow={page.categoryEyebrow}
                    title={category.name}
                    intro={page.categoryIntro}
                  />
                  <div className="card-grid">
                    {category.items.map((service) => (
                      <ViewTransition key={service.id}>
                        <ServiceCard service={service} />
                      </ViewTransition>
                    ))}
                  </div>
                </div>
            ))
          ) : (
            <EmptyState
              title={page.emptyTitle}
              message={page.emptyMessage}
            />
          )}
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
