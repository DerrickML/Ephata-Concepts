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

export async function generateMetadata() {
  const page = await readCollection("packagesPage");
  return {
    title: page.pageLabel || "Packages",
    description: page.heroIntro
  };
}

export default async function PackagesPage() {
  const [packages, categories, page] = await Promise.all([
    readCollection("packages"),
    readCollection("packageCategories"),
    readCollection("packagesPage")
  ]);
  const groups = groupedCategorizedItems(packages, categories);

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
                    {category.items.map((item) => (
                      <ViewTransition key={item.id}>
                        <PackageCard item={item} />
                      </ViewTransition>
                    ))}
                  </div>
                </div>
            ))
          ) : (
            <EmptyState title={page.emptyTitle} message={page.emptyMessage} />
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
