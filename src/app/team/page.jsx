import PageHeader from "@/components/common/PageHeader.jsx";
import SectionHeader from "@/components/common/SectionHeader.jsx";
import CTASection from "@/components/public/CTASection.jsx";
import TeamMemberGrid from "@/components/public/TeamMemberGrid.jsx";
import PageTransition from "@/components/common/PageTransition.jsx";
import { readCollection } from "@/lib/jsonStore.js";
import { groupedTeamMembers } from "@/lib/team.js";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await readCollection("teamPage");
  return {
    title: page.pageLabel || "Team",
    description: page.heroIntro
  };
}

export default async function TeamPage() {
  const [teamCategories, teamMembers, page] = await Promise.all([
    readCollection("teamCategories"),
    readCollection("teamMembers"),
    readCollection("teamPage")
  ]);
  const groups = groupedTeamMembers(teamMembers, teamCategories);

  return (
    <PageTransition>
      <PageHeader
        label={page.pageLabel}
        title={page.heroTitle}
        intro={page.heroIntro}
      />
      <section className="section-pad">
        <div className="shell">
          {groups.length ? (
            groups.map((category) => (
              <div className="category-block team-category-block" key={category.id}>
                <SectionHeader
                  eyebrow={page.categoryEyebrow}
                  title={category.name}
                  intro={category.description}
                />
                <TeamMemberGrid members={category.members} />
              </div>
            ))
          ) : (
            <div className="empty-state">
              <h2>{page.emptyTitle}</h2>
              {page.emptyMessage ? <p>{page.emptyMessage}</p> : null}
            </div>
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
