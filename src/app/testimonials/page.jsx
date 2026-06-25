import { ViewTransition } from "react";
import EmptyState from "@/components/common/EmptyState.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import TestimonialCard from "@/components/public/TestimonialCard.jsx";
import CTASection from "@/components/public/CTASection.jsx";
import PageTransition from "@/components/common/PageTransition.jsx";
import { published } from "@/lib/content.js";
import { readCollection } from "@/lib/jsonStore.js";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await readCollection("testimonialsPage");
  return {
    title: page.pageLabel || "Testimonials",
    description: page.heroIntro
  };
}

export default async function TestimonialsPage() {
  const [testimonials, page] = await Promise.all([
    readCollection("testimonials"),
    readCollection("testimonialsPage")
  ]);
  const items = published(testimonials);

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
                  <TestimonialCard item={item} />
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
