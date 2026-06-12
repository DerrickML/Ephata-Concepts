"use client";

import Link from "next/link";
import { useState } from "react";
import { ADMIN_SECTIONS, permissionLevel } from "@/lib/accessControl.js";
import { useCan } from "./AdminAccessContext.jsx";
import ConfirmDeleteModal from "./ConfirmDeleteModal.jsx";

export default function AdminAccessProfilesIndex({ initialProfiles, memberCounts }) {
  const canManage = useCan("users", "manage");
  const [profiles, setProfiles] = useState(initialProfiles);
  const [target, setTarget] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    setError("");
    const response = await fetch(`/api/admin/access-profiles/${target.id}`, { method: "DELETE" });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Unable to delete access profile.");
      setBusy(false);
      return;
    }
    setProfiles((current) => current.filter((profile) => profile.id !== target.id));
    setTarget(null);
    setBusy(false);
  }

  return (
    <section>
      <div className="admin-list-toolbar"><div className="admin-page-header"><p className="section-kicker">Identity & Access</p><h1>Access Profiles</h1><p>Reusable permission bundles keep account provisioning consistent and auditable.</p></div>{canManage ? <Link className="btn-brand" href="/admin/users/access-profiles/new">New Profile</Link> : null}</div>
      {error ? <div className="notice error">{error}</div> : null}
      <div className="access-profile-grid">
        {profiles.map((profile) => (
          <article className="access-profile-card" key={profile.id}>
            <div className="access-profile-head"><div><h2>{profile.name}</h2><p>{profile.description}</p></div><span className={profile.isSystem ? "status-badge success" : "status-badge muted"}>{profile.isSystem ? "System" : `${memberCounts[profile.id] || 0} users`}</span></div>
            <div className="profile-permission-summary">
              {ADMIN_SECTIONS.map((section) => <div key={section.key}><span>{section.label}</span><strong>{permissionLevel(profile.permissions?.[section.key], section.key)}</strong></div>)}
            </div>
            {canManage && !profile.isSystem ? <div className="table-actions"><Link className="btn-admin secondary" href={`/admin/users/access-profiles/${profile.id}/edit`}>Edit</Link><button className="btn-admin danger" type="button" onClick={() => setTarget(profile)}>Delete</button></div> : null}
          </article>
        ))}
      </div>
      <ConfirmDeleteModal item={target} label="access profile" busy={busy} onCancel={() => setTarget(null)} onConfirm={remove} />
    </section>
  );
}
