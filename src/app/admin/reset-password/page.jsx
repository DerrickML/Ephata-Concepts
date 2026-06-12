"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ login: searchParams.get("login") || "", otp: "", password: "", confirmPassword: "" });
  const [status, setStatus] = useState("idle");
  const [notice, setNotice] = useState(null);
  function update(event) { const { name, value } = event.target; setForm((current) => ({ ...current, [name]: value })); }
  async function submit(event) {
    event.preventDefault(); setStatus("submitting"); setNotice(null);
    const response = await fetch("/api/admin/password-reset/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const payload = await response.json();
    if (!response.ok) { setNotice({ type: "error", message: payload.error || "Unable to reset the password." }); setStatus("idle"); return; }
    setNotice({ type: "success", message: payload.message }); setStatus("complete");
  }
  return <section className="admin-login-card"><p className="section-kicker">Verification</p><h1>Choose Password</h1><p>Enter the code from your email and a new password of at least 10 characters.</p>{notice ? <div className={`notice ${notice.type}`}>{notice.message}</div> : null}{status !== "complete" ? <form onSubmit={submit}><div className="admin-field"><label htmlFor="reset-login">Username or Email</label><input id="reset-login" name="login" value={form.login} onChange={update} required autoComplete="username" /></div><div className="admin-field"><label htmlFor="reset-otp">Verification Code</label><input id="reset-otp" name="otp" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={form.otp} onChange={update} required autoComplete="one-time-code" /></div><div className="admin-field"><label htmlFor="reset-password">New Password</label><input id="reset-password" name="password" type="password" minLength={10} value={form.password} onChange={update} required autoComplete="new-password" /></div><div className="admin-field"><label htmlFor="reset-confirm">Confirm Password</label><input id="reset-confirm" name="confirmPassword" type="password" minLength={10} value={form.confirmPassword} onChange={update} required autoComplete="new-password" /></div><button className="btn-brand full-width" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Updating..." : "Update Password"}</button></form> : null}<Link className="admin-auth-link" href="/admin/login">Back to sign in</Link></section>;
}

export default function ResetPasswordPage() { return <main className="admin-login-page"><Suspense fallback={<section className="admin-login-card">Loading...</section>}><ResetPasswordForm /></Suspense></main>; }
