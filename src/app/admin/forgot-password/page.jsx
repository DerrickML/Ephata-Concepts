"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault(); setStatus("submitting"); setError("");
    const response = await fetch("/api/admin/password-reset/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ login }) });
    const payload = await response.json();
    if (!response.ok) { setError(payload.error || "Unable to request a verification code."); setStatus("idle"); return; }
    router.push(`/admin/reset-password?login=${encodeURIComponent(login)}`);
  }
  return <main className="admin-login-page"><section className="admin-login-card"><p className="section-kicker">Account Recovery</p><h1>Reset Password</h1><p>Enter your username or email address. Eligible accounts receive a 10-minute verification code.</p>{error ? <div className="notice error">{error}</div> : null}<form onSubmit={submit}><div className="admin-field"><label htmlFor="recovery-login">Username or Email</label><input id="recovery-login" value={login} onChange={(event) => setLogin(event.target.value)} required autoComplete="username" /></div><button className="btn-brand full-width" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Sending..." : "Send Verification Code"}</button></form><Link className="admin-auth-link" href="/admin/login">Back to sign in</Link></section></main>;
}
