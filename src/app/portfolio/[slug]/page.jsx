import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import ButtonLink from "@/components/common/ButtonLink.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import ArchImage from "@/components/public/ArchImage.jsx";
import CTASection from "@/components/public/CTASection.jsx";
import PageTransition from "@/components/common/PageTransition.jsx";
import { publishedCategorizedItems } from "@/lib/contentCategories.js";
import { getItemBySlug, readCollection } from "@/lib/jsonStore.js";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await getItemBySlug("portfolio", slug);
  return {
    title: item?.title || "Portfolio",
    description: item?.description
  };
}

export default async function PortfolioDetailPage({ params }) {
  const { slug } = await params;
  const rawItem = await getItemBySlug("portfolio", slug);
  const categories = await readCollection("portfolioCategories");
  const item = rawItem ? publishedCategorizedItems([rawItem], categories)[0] : null;
  if (!item) notFound();

  return (
    <PageTransition>
      <PageHeader label={item.categoryName} title={item.title} intro={item.description} />
      <section className="section-pad">
        <div className="shell split-section">
          <div className="narrow-copy">
            <p className="price-line">
              {item.location} · {item.date}
            </p>
            <p>Planning structure, guest flow, vendor clarity, and a composed event day.</p>
            <ButtonLink href="/book-consultation">Plan a Similar Event</ButtonLink>
          </div>
          <ViewTransition name={`portfolio-cover-${item.id}`} share="morph">
            <ArchImage src={item.coverImage} alt={item.title} />
          </ViewTransition>
        </div>
        {item.gallery?.length ? (
          <div className="shell gallery-grid">
            {item.gallery.map((image) => (
              <ArchImage key={image} src={image} alt={`${item.title} gallery image`} />
            ))}
          </div>
        ) : null}
      </section>
      <CTASection />
    </PageTransition>
  );
}
