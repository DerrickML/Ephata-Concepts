import { ViewTransition } from "react";
import EmptyState from "@/components/common/EmptyState.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import SectionHeader from "@/components/common/SectionHeader.jsx";
import PackageCard from "@/components/public/PackageCard.jsx";
import CTASection from "@/components/public/CTASection.jsx";
import PageTransition from "@/components/common/PageTransition.jsx";
import { groupedCategorizedItems } from "@/lib/contentCategories.js";
import { readCollection } from "@/lib/jsonStore.js";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Packages",
  description:
    "Wedding, corporate, custom, additional service, and promotional packages from Ephata Concepts."
};

export default async function PackagesPage() {
  const [packages, categories] = await Promise.all([
    readCollection("packages"),
    readCollection("packageCategories")
  ]);
  const groups = groupedCategorizedItems(packages, categories);

  return (
    <PageTransition>
      <PageHeader
        label="Packages"
        title="Packages with room to breathe."
        intro="Start clear. Shape the scope after the consultation."
      />
      <section className="section-pad">
        <div className="shell">
          {groups.length ? (
            groups.map((category) => (
                <div className="category-block" key={category.id}>
                  <SectionHeader
                    eyebrow="Package Group"
                    title={category.name}
                    intro="Simple starting points. Flexible scope."
                  />
                  <div className="card-grid">
                    {category.items.map((item) => (
                      <ViewTransition key={item.id}>
                        <PackageCard item={item} />
                      </ViewTransition>
                    ))}
                  </div>
                </div>
            ))
          ) : (
            <EmptyState title="No packages published yet" />
          )}
        </div>
      </section>
      <CTASection />
    </PageTransition>
  );
}
