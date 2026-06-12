import AdminUsersNav from "@/components/admin/AdminUsersNav.jsx";
import { readCollection } from "@/lib/jsonStore.js";

export const metadata = { title: "Admin Audit Log" };
export default async function AuditLogPage() {
  const entries = (await readCollection("auditLog")).slice().reverse().slice(0, 250);
  return <><AdminUsersNav /><section><div className="admin-page-header"><p className="section-kicker">Identity & Access</p><h1>Audit Log</h1><p>Recent authentication, account, permission, content, and settings activity.</p></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Section</th><th>Details</th></tr></thead><tbody>{entries.map((entry) => <tr key={entry.id}><td>{new Date(entry.createdAt).toLocaleString()}</td><td>{entry.actorName}</td><td><span className="status-badge muted">{entry.action.replaceAll("_", " ")}</span></td><td>{entry.section}</td><td>{entry.summary}</td></tr>)}</tbody></table>{entries.length ? null : <div className="admin-empty">No audit activity yet.</div>}</div></section></>;
}
