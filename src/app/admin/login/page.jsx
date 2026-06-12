"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [passwordResetEnabled, setPasswordResetEnabled] = useState(false);

  useEffect(() => {
    fetch("/api/admin/password-reset/status")
      .then((response) => response.json())
      .then((payload) => setPasswordResetEnabled(Boolean(payload.enabled)))
      .catch(() => setPasswordResetEnabled(false));
  }, []);

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setStatus("submitting");
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Login failed.");
      setStatus("idle");
      return;
    }
    router.push(payload.mustChangePassword ? "/admin/change-password" : "/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <p className="section-kicker">Ephata Concepts</p>
        <h1>Admin Login</h1>
        <p>Sign in with your assigned administration account.</p>
        {error ? <div className="notice error">{error}</div> : null}
        <form onSubmit={submit}>
          <div className="admin-field">
            <label htmlFor="adminUsername">Username</label>
            <input id="adminUsername" name="username" value={form.username} onChange={update} required />
          </div>
          <div className="admin-field">
            <label htmlFor="adminPassword">Password</label>
            <input
              id="adminPassword"
              type="password"
              name="password"
              value={form.password}
              onChange={update}
              required
            />
          </div>
          <button className="btn-brand full-width" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Signing in..." : "Sign In"}
          </button>
        </form>
        {passwordResetEnabled ? <Link className="admin-auth-link" href="/admin/forgot-password">Forgot your password?</Link> : null}
        <p className="admin-login-note">
          Access is governed by your account status, access profile, and approved permission overrides.
        </p>
      </section>
    </main>
  );
}
