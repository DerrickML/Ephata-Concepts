import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import PageHeader from "@/components/common/PageHeader.jsx";
import SectionHeader from "@/components/common/SectionHeader.jsx";
import CTASection from "@/components/public/CTASection.jsx";
import ArchImage from "@/components/public/ArchImage.jsx";
import RichTextRenderer from "@/components/public/RichTextRenderer.jsx";
import RelatedInsightsSlider from "@/components/public/RelatedInsightsSlider.jsx";
import PageTransition from "@/components/common/PageTransition.jsx";
import { publishedCategorizedItems } from "@/lib/contentCategories.js";
import { getItemBySlug, readCollection } from "@/lib/jsonStore.js";
import { relatedInsights } from "@/lib/insights.js";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getItemBySlug("insights", slug);
  return {
    title: post?.title || "Insight",
    description: post?.excerpt
  };
}

export default async function InsightDetailPage({ params }) {
  const { slug } = await params;
  const [posts, categories] = await Promise.all([
    readCollection("insights"),
    readCollection("insightCategories")
  ]);
  const visiblePosts = publishedCategorizedItems(posts, categories);
  const post = visiblePosts.find((item) => item.slug === slug);
  if (!post) notFound();
  const related = relatedInsights(post, visiblePosts);

  return (
    <PageTransition>
      <PageHeader label={post.categoryName} title={post.title} intro={post.excerpt} />
      {post.coverImage ? (
        <section className="compact-section">
          <div className="shell">
            <ViewTransition name={`insight-image-${post.id}`} share="morph">
              <ArchImage src={post.coverImage} alt={post.title} className="article-cover" priority />
            </ViewTransition>
          </div>
        </section>
      ) : null}
      <article className="section-pad">
        <div className="shell article-copy">
          <p className="card-category">
            {post.categoryName} · {post.publishedDate} · {post.author}
          </p>
          <RichTextRenderer value={post.body} className="rich-text article-rich-text" />
          {post.tags?.length ? (
            <div className="tag-row">
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          ) : null}
        </div>
      </article>
      {related.length ? (
        <section className="section-pad muted-band related-insights-section" id="related-insights">
          <div className="shell">
            <SectionHeader
              eyebrow="Continue Reading"
              title="Related insights."
              intro="Selected by shared topics and category."
            />
            <RelatedInsightsSlider items={related} />
          </div>
        </section>
      ) : null}
      <CTASection />
    </PageTransition>
  );
}
