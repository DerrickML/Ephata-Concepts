import Link from "next/link";
import { readCollection } from "@/lib/jsonStore.js";
import { ADMIN_NAV_ITEMS } from "@/lib/constants.js";
import { requireAdminPage } from "@/lib/auth.js";
import { hasPermission } from "@/lib/accessControl.js";

export const metadata = {
  title: "Admin Dashboard"
};

export default async function AdminDashboardPage() {
  const admin = await requireAdminPage();
  const [
    services,
    packages,
    portfolio,
    galleryAlbums,
    testimonials,
    insights,
    teamCategories,
    teamMembers,
    enquiries,
    users
  ] = await Promise.all([
    readCollection("services"),
    readCollection("packages"),
    readCollection("portfolio"),
    readCollection("galleryAlbums"),
    readCollection("testimonials"),
    readCollection("insights"),
    readCollection("teamCategories"),
    readCollection("teamMembers"),
    readCollection("enquiries"),
    readCollection("users")
  ]);

  const cards = [
    { label: "Services", value: services.length, href: "/admin/services" },
    { label: "Packages", value: packages.length, href: "/admin/packages" },
    { label: "Portfolio", value: portfolio.length, href: "/admin/portfolio" },
    { label: "Gallery", value: galleryAlbums.length, href: "/admin/gallery" },
    { label: "Testimonials", value: testimonials.length, href: "/admin/testimonials" },
    { label: "Insights", value: insights.length, href: "/admin/insights" },
    { label: "Team", value: `${teamMembers.length}/${teamCategories.length}`, href: "/admin/team" },
    { label: "Contact Page", value: "Settings", href: "/admin/settings?panel=contact" },
    { label: "Consultation Page", value: "Settings", href: "/admin/settings?panel=consultation" },
    {
      label: "Contact Messages",
      value: enquiries.filter((item) => item.status === "new" && item.source === "contact").length,
      href: "/admin/enquiries"
    },
    {
      label: "Consultation Requests",
      value: enquiries.filter((item) => item.status === "new" && (item.source || "consultation") === "consultation").length,
      href: "/admin/enquiries"
    },
    { label: "User Accounts", value: users.length, href: "/admin/users" }
  ].filter((card) => {
    const navItem = ADMIN_NAV_ITEMS.find((item) => card.href === item.href || card.href.startsWith(`${item.href}?`));
    if (card.href === "/admin/enquiries") return hasPermission(admin, "enquiries", "view");
    if (card.href.startsWith("/admin/settings")) return hasPermission(admin, "settings", "view");
    return !navItem?.section || hasPermission(admin, navItem.section, "view");
  });

  const visibleNavItems = ADMIN_NAV_ITEMS.filter(
    (item) => item.href !== "/admin/dashboard" && (!item.section || hasPermission(admin, item.section, "view"))
  );

  return (
    <section>
      <div className="admin-page-header">
        <p className="section-kicker">Dashboard</p>
        <h1>Content Overview</h1>
        <p>Review website content counts and jump into the most common admin tasks.</p>
      </div>
      <div className="admin-summary-grid">
        {cards.map((card) => (
          <Link className="admin-summary-card" href={card.href} key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </Link>
        ))}
      </div>
      <div className="admin-form-card wide admin-spaced">
        <div className="admin-panel-body">
          <h2>Admin Areas</h2>
          <div className="admin-link-grid">
            {visibleNavItems.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
