import PageHeader from "@/components/common/PageHeader.jsx";
import SectionHeader from "@/components/common/SectionHeader.jsx";
import ArchImage from "@/components/public/ArchImage.jsx";
import CTASection from "@/components/public/CTASection.jsx";
import TeamSlider from "@/components/public/TeamSlider.jsx";
import PageTransition from "@/components/common/PageTransition.jsx";
import { readCollection } from "@/lib/jsonStore.js";
import { featuredTeamMembers } from "@/lib/team.js";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await readCollection("aboutPage");
  return {
    title: page.pageLabel || "About",
    description: page.heroIntro
  };
}

export default async function AboutPage() {
  const [settings, page, teamCategories, teamMembers] = await Promise.all([
    readCollection("settings"),
    readCollection("aboutPage"),
    readCollection("teamCategories"),
    readCollection("teamMembers")
  ]);
  const featuredTeam = featuredTeamMembers(teamMembers, teamCategories, 5);
  const values = Array.isArray(page.valuesItems) ? page.valuesItems : [];

  return (
    <PageTransition>
      <PageHeader
        label={page.pageLabel}
        title={page.heroTitle}
        intro={page.heroIntro}
      />
      <section className="section-pad">
        <div className="shell split-section">
          <div>
            <SectionHeader
              eyebrow={page.storyEyebrow}
              title={page.storyTitle}
              intro={page.storyIntro}
            />
            <p>{page.storyBody}</p>
          </div>
          <ArchImage
            src={settings?.aboutImage}
            defaultSrc="/images/about-default.png"
            alt="Archway and staircase inspired brand visual"
          />
        </div>
      </section>

      <section className="section-pad muted-band">
        <div className="shell two-col-grid">
          <SectionHeader
            eyebrow={page.missionEyebrow}
            title={page.missionTitle}
            intro={page.missionIntro}
          />
          <div className="values-grid">
            {values.map((value) => (
              <article className="value-card" key={value.label}>
                <h3>{value.label}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="shell">
          <SectionHeader
            eyebrow={page.teamEyebrow}
            title={page.teamTitle}
            intro={page.teamIntro}
            align="right"
          />
          <TeamSlider members={featuredTeam} />
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
