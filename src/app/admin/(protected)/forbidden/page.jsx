import Link from "next/link";

export const metadata = { title: "Access Denied" };

export default function AdminForbiddenPage() {
  return (
    <section className="admin-state-page">
      <p className="section-kicker">Access Restricted</p>
      <h1>This section is not available to your account.</h1>
      <p>Ask a system administrator to review your access profile or account-specific permissions.</p>
      <Link className="btn-brand" href="/admin/dashboard">Return to dashboard</Link>
    </section>
  );
}
