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

export async function generateMetadata() {
  const page = await readCollection("insightsPage");
  return {
    title: page.pageLabel || "Insights",
    description: page.heroIntro
  };
}

export default async function InsightsPage() {
  const [posts, categories, page] = await Promise.all([
    readCollection("insights"),
    readCollection("insightCategories"),
    readCollection("insightsPage")
  ]);
  const visiblePosts = sortInsightsByDate(publishedCategorizedItems(posts, categories));
  const visibleCategories = published(categories);

  return (
    <PageTransition>
      <PageHeader
        label={page.pageLabel}
        title={page.heroTitle}
        intro={page.heroIntro}
      />
      <section className="section-pad">
        <div className="shell">
          {visiblePosts.length ? (
            <InsightExplorer posts={visiblePosts} categories={visibleCategories} />
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
