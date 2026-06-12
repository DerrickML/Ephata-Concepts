import PageHeader from "@/components/common/PageHeader.jsx";
import SectionHeader from "@/components/common/SectionHeader.jsx";
import CTASection from "@/components/public/CTASection.jsx";
import TeamMemberGrid from "@/components/public/TeamMemberGrid.jsx";
import PageTransition from "@/components/common/PageTransition.jsx";
import { readCollection } from "@/lib/jsonStore.js";
import { groupedTeamMembers } from "@/lib/team.js";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Team",
  description: "Meet the Ephata Concepts team behind our event planning and coordination work."
};

export default async function TeamPage() {
  const [teamCategories, teamMembers] = await Promise.all([
    readCollection("teamCategories"),
    readCollection("teamMembers")
  ]);
  const groups = groupedTeamMembers(teamMembers, teamCategories);

  return (
    <PageTransition>
      <PageHeader
        label="Team"
        title="People behind the calm."
        intro="A focused team for planning, coordination, and guest experience."
      />
      <section className="section-pad">
        <div className="shell">
          {groups.length ? (
            groups.map((category) => (
              <div className="category-block team-category-block" key={category.id}>
                <SectionHeader
                  eyebrow="Team Category"
                  title={category.name}
                  intro={category.description}
                />
                <TeamMemberGrid members={category.members} />
              </div>
            ))
          ) : (
            <div className="empty-state">
              <h2>Team details are coming soon.</h2>
              <p>Check back for the full Ephata Concepts team.</p>
            </div>
          )}
        </div>
      </section>
      <CTASection />
    </PageTransition>
  );
}
