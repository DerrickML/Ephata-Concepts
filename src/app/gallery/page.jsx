import EmptyState from "@/components/common/EmptyState.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import CTASection from "@/components/public/CTASection.jsx";
import GalleryAlbumLayout from "@/components/public/GalleryAlbumLayout.jsx";
import PageTransition from "@/components/common/PageTransition.jsx";
import { GALLERY_DISPLAY_STYLES } from "@/lib/constants.js";
import { published } from "@/lib/content.js";
import { readCollection } from "@/lib/jsonStore.js";

export const dynamic = "force-dynamic";

const displayStyles = new Set(GALLERY_DISPLAY_STYLES.map((style) => style.value));

export async function generateMetadata() {
  const page = await readCollection("galleryPage");
  return {
    title: page.pageLabel || "Gallery",
    description: page.heroIntro
  };
}

export default async function GalleryPage() {
  const [albums, page] = await Promise.all([
    readCollection("galleryAlbums"),
    readCollection("galleryPage")
  ]);
  const items = published(albums);
  const displayStyle = displayStyles.has(page.displayStyle) ? page.displayStyle : "bento";

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
            <GalleryAlbumLayout albums={items} page={page} displayStyle={displayStyle} />
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
