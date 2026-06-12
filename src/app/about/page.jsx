import PageHeader from "@/components/common/PageHeader.jsx";
import SectionHeader from "@/components/common/SectionHeader.jsx";
import ArchImage from "@/components/public/ArchImage.jsx";
import CTASection from "@/components/public/CTASection.jsx";
import TeamSlider from "@/components/public/TeamSlider.jsx";
import PageTransition from "@/components/common/PageTransition.jsx";
import { readCollection } from "@/lib/jsonStore.js";
import { featuredTeamMembers } from "@/lib/team.js";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About",
  description:
    "Learn about Ephata Concepts, the meaning of Ephata, and the values behind our event planning and coordination work."
};

const values = [
  {
    title: "Excellence",
    body: "We plan with care, refine the details, and aim to get it right the first time."
  },
  {
    title: "Timely Delivery",
    body: "We respect time, timelines, and the flow of every event."
  },
  {
    title: "Accountability",
    body: "We take ownership of the process and communicate clearly from planning to execution."
  }
];

export default async function AboutPage() {
  const [settings, teamCategories, teamMembers] = await Promise.all([
    readCollection("settings"),
    readCollection("teamCategories"),
    readCollection("teamMembers")
  ]);
  const featuredTeam = featuredTeamMembers(teamMembers, teamCategories, 5);

  return (
    <PageTransition>
      <PageHeader
        label="About"
        title="A calm opening."
        intro="Events held with grace, order, and care."
      />
      <section className="section-pad">
        <div className="shell split-section">
          <div>
            <SectionHeader
              eyebrow="Brand Story"
              title="Ephata means “be opened”."
              intro="An opening into a new stage. A staircase into what comes next."
            />
            <p>We plan with warmth, structure, and a steady eye on the guest experience.</p>
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
            eyebrow="Mission"
            title="Clear. Accountable. Beautifully held."
            intro="We protect the experience and keep decisions connected to the client’s priorities."
          />
          <div className="values-grid">
            {values.map((value) => (
              <article className="value-card" key={value.title}>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="shell">
          <SectionHeader
            eyebrow="Team"
            title="Steady hands."
            intro="Meet the people shaping the calm behind each event."
            align="right"
          />
          <TeamSlider members={featuredTeam} />
        </div>
      </section>
      <CTASection />
    </PageTransition>
  );
}
