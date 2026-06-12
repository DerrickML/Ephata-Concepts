"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdminAccess, useCan } from "./AdminAccessContext.jsx";
import ConfirmDeleteModal from "./ConfirmDeleteModal.jsx";

function formatTimestamp(value) {
  if (!value) return "Never";
  return `${new Date(value).toISOString().replace("T", " ").slice(0, 16)} UTC`;
}

export default function AdminUsersIndex({ initialUsers }) {
  const currentUser = useAdminAccess();
  const canCreate = useCan("users", "create");
  const canEdit = useCan("users", "edit");
  const canDelete = useCan("users", "delete");
  const [users, setUsers] = useState(initialUsers);
  const [target, setTarget] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!target) return;
    setBusy(true);
    setError("");
    const response = await fetch(`/api/admin/users/${target.id}`, { method: "DELETE" });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Unable to delete user.");
      setBusy(false);
      return;
    }
    setUsers((current) => current.filter((user) => user.id !== target.id));
    setTarget(null);
    setBusy(false);
  }

  return (
    <section>
      <div className="admin-list-toolbar">
        <div className="admin-page-header"><p className="section-kicker">Identity & Access</p><h1>User Accounts</h1><p>Manage account lifecycle, organizational titles, access profiles, and individual permission exceptions.</p></div>
        {canCreate ? <Link className="btn-brand" href="/admin/users/new">New User</Link> : null}
      </div>
      {error ? <div className="notice error">{error}</div> : null}
      <div className="admin-table-wrap">
        <table className="admin-table user-table">
          <thead><tr><th>User</th><th>Job Title</th><th>Access Profile</th><th>Status</th><th>Last Login</th>{canEdit || canDelete ? <th>Actions</th> : null}</tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td><strong>{user.name}</strong><br /><span>{user.email}</span><br /><small>@{user.username}</small></td>
                <td>{user.jobTitle || "Not specified"}</td>
                <td>{user.accessProfileName}</td>
                <td><span className={`status-badge ${user.status === "active" ? "success" : user.status === "pending" ? "warning" : "muted"}`}>{user.status}</span></td>
                <td>{formatTimestamp(user.lastLoginAt)}</td>
                {canEdit || canDelete ? (
                  <td><div className="table-actions">{canEdit ? <Link className="btn-admin secondary" href={`/admin/users/${user.id}/edit`}>Edit</Link> : null}{canDelete && user.id !== currentUser.id && !user.isSystemOwner ? <button className="btn-admin danger" type="button" onClick={() => setTarget(user)}>Delete</button> : null}</div></td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmDeleteModal item={target} label="user account" busy={busy} onCancel={() => setTarget(null)} onConfirm={remove} />
    </section>
  );
}
