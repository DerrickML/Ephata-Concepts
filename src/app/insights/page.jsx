import EmptyState from "@/components/common/EmptyState.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import CTASection from "@/components/public/CTASection.jsx";
import InsightExplorer from "@/components/public/InsightExplorer.jsx";
import PageTransition from "@/components/common/PageTransition.jsx";
import { publishedCategorizedItems } from "@/lib/contentCategories.js";
import { published } from "@/lib/content.js";
import { sortInsightsByDate } from "@/lib/insights.js";
import { readCollection } from "@/lib/jsonStore.js";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Insights",
  description: "Event planning tips, coordination notes, and guidance from Ephata Concepts."
};

export default async function InsightsPage() {
  const [posts, categories] = await Promise.all([
    readCollection("insights"),
    readCollection("insightCategories")
  ]);
  const visiblePosts = sortInsightsByDate(publishedCategorizedItems(posts, categories));
  const visibleCategories = published(categories);

  return (
    <PageTransition>
      <PageHeader
        label="Insights"
        title="Notes for calmer events."
        intro="Practical planning guidance, kept brief."
      />
      <section className="section-pad">
        <div className="shell">
          {visiblePosts.length ? (
            <InsightExplorer posts={visiblePosts} categories={visibleCategories} />
          ) : (
            <EmptyState title="No insights published yet" />
          )}
        </div>
      </section>
      <CTASection />
    </PageTransition>
  );
}
