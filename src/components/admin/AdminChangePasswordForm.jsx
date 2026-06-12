"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminChangePasswordForm() {
  const router = useRouter();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setStatus("saving");
    setError("");
    const response = await fetch("/api/admin/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const payload = await response.json();
    if (!response.ok) { setError(payload.error || "Unable to change password."); setStatus("idle"); return; }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="admin-login-page"><section className="admin-login-card"><p className="section-kicker">Account Security</p><h1>Change Password</h1><p>Set a private password before continuing to the administration console.</p>{error ? <div className="notice error">{error}</div> : null}<form onSubmit={submit}><div className="admin-field"><label htmlFor="current-password">Current Password</label><input id="current-password" type="password" autoComplete="current-password" value={form.currentPassword} onChange={(event) => setForm((current) => ({ ...current, currentPassword: event.target.value }))} required /></div><div className="admin-field"><label htmlFor="new-password">New Password</label><input id="new-password" type="password" autoComplete="new-password" minLength={10} value={form.newPassword} onChange={(event) => setForm((current) => ({ ...current, newPassword: event.target.value }))} required /></div><div className="admin-field"><label htmlFor="confirm-password">Confirm New Password</label><input id="confirm-password" type="password" autoComplete="new-password" minLength={10} value={form.confirmPassword} onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))} required /></div><button className="btn-brand full-width" type="submit" disabled={status === "saving"}>{status === "saving" ? "Updating..." : "Update Password"}</button></form></section></main>
  );
}
