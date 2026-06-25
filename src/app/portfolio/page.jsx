import { ViewTransition } from "react";
import EmptyState from "@/components/common/EmptyState.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import PortfolioCard from "@/components/public/PortfolioCard.jsx";
import CTASection from "@/components/public/CTASection.jsx";
import PageTransition from "@/components/common/PageTransition.jsx";
import { publishedCategorizedItems } from "@/lib/contentCategories.js";
import { readCollection } from "@/lib/jsonStore.js";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await readCollection("portfolioPage");
  return {
    title: page.pageLabel || "Portfolio",
    description: page.heroIntro
  };
}

export default async function PortfolioPage() {
  const [portfolio, categories, page] = await Promise.all([
    readCollection("portfolio"),
    readCollection("portfolioCategories"),
    readCollection("portfolioPage")
  ]);
  const items = publishedCategorizedItems(portfolio, categories);

  return (
    <PageTransition>
      <PageHeader
        label={page.pageLabel}
        title={page.heroTitle}
        intro={page.heroIntro}
      />
      <section className="section-pad">
        <div className="shell">
          {items.length ? (
            <div className="card-grid">
              {items.map((item) => (
                <ViewTransition key={item.id}>
                  <PortfolioCard item={item} />
                </ViewTransition>
              ))}
            </div>
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
