import { ViewTransition } from "react";
import EmptyState from "@/components/common/EmptyState.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import TestimonialCard from "@/components/public/TestimonialCard.jsx";
import CTASection from "@/components/public/CTASection.jsx";
import PageTransition from "@/components/common/PageTransition.jsx";
import { published } from "@/lib/content.js";
import { readCollection } from "@/lib/jsonStore.js";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Testimonials",
  description: "Client words about Ephata Concepts event planning and coordination."
};

export default async function TestimonialsPage() {
  const items = published(await readCollection("testimonials"));

  return (
    <PageTransition>
      <PageHeader
        label="Testimonials"
        title="Clients remember the calm."
        intro="Short notes from people who trusted us with the details."
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
            <EmptyState title="No testimonials published yet" />
          )}
        </div>
      </section>
      <CTASection />
    </PageTransition>
  );
}
