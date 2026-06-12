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

export const metadata = {
  title: "Services",
  description:
    "Explore Ephata Concepts event planning, coordination, guest management, vendor management, content creation, and reporting services."
};

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([
    readCollection("services"),
    readCollection("serviceCategories")
  ]);
  const groups = groupedCategorizedItems(services, categories);

  return (
    <PageTransition>
      <PageHeader
        label="Services"
        title="Support that composes the day."
        intro="Planning, coordination, guest flow, vendors, content, and reflection."
      />
      <section className="section-pad">
        <div className="shell">
          {groups.length ? (
            groups.map((category) => (
                <div className="category-block" key={category.id}>
                  <SectionHeader
                    eyebrow="Service Category"
                    title={category.name}
                    intro="Standalone support or part of a tailored package."
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
              title="No services published yet"
              message="Services added in the admin panel will appear here."
            />
          )}
        </div>
      </section>
      <CTASection />
    </PageTransition>
  );
}
