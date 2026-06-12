"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PermissionsMatrix from "./PermissionsMatrix.jsx";

const EMPTY_OVERRIDES = {};

export default function AdminUserForm({ user = null, profiles = [], lockAccess = false, emailAvailable = false }) {
  const router = useRouter();
  const editing = Boolean(user);
  const [form, setForm] = useState(() => ({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
    jobTitle: user?.jobTitle || "",
    status: user?.status || "active",
    accessProfileId: user?.accessProfileId || profiles[0]?.id || "",
    password: "",
    sendInvitation: !editing && emailAvailable,
    mustChangePassword: user?.mustChangePassword ?? true,
    notifyOnEnquiries: user?.notifyOnEnquiries ?? true,
    permissionOverrides: user?.permissionOverrides || EMPTY_OVERRIDES
  }));
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function update(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  async function submit(event) {
    event.preventDefault();
    setStatus("saving");
    setError("");
    const response = await fetch(editing ? `/api/admin/users/${user.id}` : "/api/admin/users", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Unable to save user.");
      setStatus("idle");
      return;
    }
    router.push("/admin/users");
    router.refresh();
  }

  async function resendInvitation() {
    setStatus("sending");
    setError("");
    setMessage("");
    const response = await fetch(`/api/admin/users/${user.id}/resend-invitation`, { method: "POST" });
    const payload = await response.json();
    if (!response.ok) setError(payload.error || "Unable to resend the invitation.");
    else setMessage(`Invitation queued with status: ${payload.deliveryStatus}.`);
    setStatus("idle");
  }

  return (
    <section>
      <div className="admin-page-header">
        <p className="section-kicker">User Management</p>
        <h1>{editing ? `Edit ${user.name}` : "Create User Account"}</h1>
        <p>Separate the person’s job title from the access profile that controls administration permissions.</p>
      </div>
      {lockAccess ? <div className="notice warning">Account status and permission overrides are protected. Existing protected accounts also retain their assigned access profile.</div> : null}
      {error ? <div className="notice error">{error}</div> : null}
      {message ? <div className="notice success">{message}</div> : null}
      <form className="admin-user-form" onSubmit={submit}>
        <div className="admin-form-card wide">
          <div className="admin-panel-body">
            <h2>Account Details</h2>
            <div className="admin-form-grid">
              <div className="admin-field"><label htmlFor="user-name">Full Name</label><input id="user-name" name="name" value={form.name} onChange={update} required /></div>
              <div className="admin-field"><label htmlFor="user-title">Job Title</label><input id="user-title" name="jobTitle" value={form.jobTitle} onChange={update} /></div>
              <div className="admin-field"><label htmlFor="user-email">Email</label><input id="user-email" name="email" type="email" value={form.email} onChange={update} required /></div>
              <div className="admin-field"><label htmlFor="user-username">Username</label><input id="user-username" name="username" value={form.username} onChange={update} required /></div>
              <div className="admin-field">
                <label htmlFor="user-status">Account Status</label>
                <select id="user-status" name="status" value={form.status} onChange={update} disabled={lockAccess}>
                  <option value="active">Active</option><option value="pending">Pending activation</option><option value="suspended">Suspended</option><option value="deactivated">Deactivated</option>
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor="user-profile">Access Profile</label>
                <select id="user-profile" name="accessProfileId" value={form.accessProfileId} onChange={update} disabled={lockAccess && editing} required>
                  {profiles.map((profile) => <option value={profile.id} key={profile.id}>{profile.name}</option>)}
                </select>
              </div>
              <div className="admin-field admin-field-span">
                <label htmlFor="user-password">{editing ? "New Password (optional)" : "Temporary Password"}</label>
                <input id="user-password" name="password" type="password" minLength={10} value={form.password} onChange={update} required={!editing && !form.sendInvitation} disabled={!editing && form.sendInvitation} autoComplete="new-password" />
                <p className="admin-field-help">At least 10 characters. Updating a password revokes the user’s active sessions.</p>
              </div>
              {!editing ? <label className="admin-check admin-field-span"><input type="checkbox" name="sendInvitation" checked={form.sendInvitation} onChange={update} disabled={!emailAvailable} /><span><strong>Send secure account invitation</strong><small>{emailAvailable ? "The account remains pending until the user chooses a password." : "Verify SMTP and enable account invitations in Settings to use this option."}</small></span></label> : null}
              <label className="admin-check admin-field-span"><input type="checkbox" name="mustChangePassword" checked={form.mustChangePassword} onChange={update} disabled={!editing && form.sendInvitation} /><span>Require a password change on the next sign-in</span></label>
              <label className="admin-check admin-field-span"><input type="checkbox" name="notifyOnEnquiries" checked={form.notifyOnEnquiries} onChange={update} /><span><strong>Receive enquiry email notifications</strong><small>Sent only while this account is active and has Enquiries view access.</small></span></label>
              {editing && user.status === "pending" && emailAvailable ? <div className="admin-field-span"><button className="btn-admin secondary" type="button" onClick={resendInvitation} disabled={status !== "idle"}>{status === "sending" ? "Sending..." : "Resend Activation Invitation"}</button></div> : null}
            </div>
          </div>
        </div>
        <div className="admin-form-card wide">
          <div className="admin-panel-body">
            <h2>Account-Specific Overrides</h2>
            <p className="admin-panel-intro">Use overrides sparingly. Inherit keeps the account aligned with its access profile.</p>
            <PermissionsMatrix mode="overrides" value={form.permissionOverrides} onChange={(permissionOverrides) => setForm((current) => ({ ...current, permissionOverrides }))} disabled={lockAccess} />
          </div>
        </div>
        <div className="button-row">
          <button className="btn-brand" type="submit" disabled={status === "saving"}>{status === "saving" ? "Saving..." : editing ? "Save User" : "Create User"}</button>
          <Link className="btn-admin secondary" href="/admin/users">Cancel</Link>
        </div>
      </form>
    </section>
  );
}
