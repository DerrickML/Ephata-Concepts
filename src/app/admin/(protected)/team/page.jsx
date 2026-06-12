import Link from "next/link";
import { readCollection } from "@/lib/jsonStore.js";

export const metadata = {
  title: "Admin Team"
};

export default async function AdminTeamPage() {
  const [teamCategories, teamMembers] = await Promise.all([
    readCollection("teamCategories"),
    readCollection("teamMembers")
  ]);

  const publishedMembers = teamMembers.filter((member) => member.published !== false).length;
  const publishedCategories = teamCategories.filter((category) => category.published !== false).length;

  const cards = [
    {
      label: "Team Members",
      value: teamMembers.length,
      detail: `${publishedMembers} published`,
      href: "/admin/team/members"
    },
    {
      label: "Team Categories",
      value: teamCategories.length,
      detail: `${publishedCategories} published`,
      href: "/admin/team/categories"
    }
  ];

  return (
    <section>
      <div className="admin-page-header">
        <p className="section-kicker">Team</p>
        <h1>Team Management</h1>
        <p>Manage team categories and the people assigned to them from one place.</p>
      </div>
      <div className="admin-summary-grid">
        {cards.map((card) => (
          <Link className="admin-summary-card" href={card.href} key={card.href}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.detail}</small>
          </Link>
        ))}
      </div>
      <div className="admin-form-card wide admin-spaced">
        <div className="admin-panel-body">
          <h2>Team Workflow</h2>
          <p>Create categories first, then add members and assign each person to the right category.</p>
          <div className="admin-link-grid">
            <Link href="/admin/team/categories/new">New Category</Link>
            <Link href="/admin/team/members/new">New Member</Link>
            <Link href="/admin/team/categories">Manage Categories</Link>
            <Link href="/admin/team/members">Manage Members</Link>
            <Link href="/team">View Public Team Page</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
