import { ViewTransition } from "react";
import EmptyState from "@/components/common/EmptyState.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import PortfolioCard from "@/components/public/PortfolioCard.jsx";
import CTASection from "@/components/public/CTASection.jsx";
import PageTransition from "@/components/common/PageTransition.jsx";
import { publishedCategorizedItems } from "@/lib/contentCategories.js";
import { readCollection } from "@/lib/jsonStore.js";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portfolio",
  description:
    "Explore weddings, corporate functions, retreats, and celebrations coordinated by Ephata Concepts."
};

export default async function PortfolioPage() {
  const [portfolio, categories] = await Promise.all([
    readCollection("portfolio"),
    readCollection("portfolioCategories")
  ]);
  const items = publishedCategorizedItems(portfolio, categories);

  return (
    <PageTransition>
      <PageHeader
        label="Portfolio"
        title="Quietly composed work."
        intro="Weddings, gatherings, retreats, and professional moments."
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
            <EmptyState title="No portfolio items published yet" />
          )}
        </div>
      </section>
      <CTASection />
    </PageTransition>
  );
}
