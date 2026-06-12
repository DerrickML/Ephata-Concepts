"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { emptyPermissions } from "@/lib/accessControl.js";
import PermissionsMatrix from "./PermissionsMatrix.jsx";

export default function AdminAccessProfileForm({ profile = null }) {
  const router = useRouter();
  const editing = Boolean(profile);
  const [form, setForm] = useState({ name: profile?.name || "", description: profile?.description || "", permissions: profile?.permissions || emptyPermissions() });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setStatus("saving");
    setError("");
    const response = await fetch(editing ? `/api/admin/access-profiles/${profile.id}` : "/api/admin/access-profiles", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Unable to save access profile.");
      setStatus("idle");
      return;
    }
    router.push("/admin/users/access-profiles");
    router.refresh();
  }

  return (
    <section>
      <div className="admin-page-header"><p className="section-kicker">Access Profiles</p><h1>{editing ? `Edit ${profile.name}` : "New Access Profile"}</h1><p>Define reusable section-level permissions for groups of administration users.</p></div>
      {error ? <div className="notice error">{error}</div> : null}
      <form onSubmit={submit} className="admin-user-form">
        <div className="admin-form-card wide"><div className="admin-panel-body">
          <div className="admin-form-grid">
            <div className="admin-field"><label htmlFor="profile-name">Profile Name</label><input id="profile-name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required /></div>
            <div className="admin-field admin-field-span"><label htmlFor="profile-description">Description</label><textarea id="profile-description" rows={3} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></div>
          </div>
        </div></div>
        <div className="admin-form-card wide"><div className="admin-panel-body"><h2>Section Permissions</h2><p className="admin-panel-intro">Choose a standard level, then refine individual actions where necessary.</p><PermissionsMatrix value={form.permissions} onChange={(permissions) => setForm((current) => ({ ...current, permissions }))} /></div></div>
        <div className="button-row"><button className="btn-brand" type="submit" disabled={status === "saving"}>{status === "saving" ? "Saving..." : "Save Access Profile"}</button><Link className="btn-admin secondary" href="/admin/users/access-profiles">Cancel</Link></div>
      </form>
    </section>
  );
}
