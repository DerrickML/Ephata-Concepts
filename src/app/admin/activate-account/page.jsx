"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ActivationForm() {
  const token = useSearchParams().get("token") || "";
  const [account, setAccount] = useState(null);
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [status, setStatus] = useState("loading");
  const [notice, setNotice] = useState(null);
  useEffect(() => {
    fetch(`/api/admin/account-activation?token=${encodeURIComponent(token)}`).then(async (response) => ({ response, payload: await response.json() })).then(({ response, payload }) => { if (!response.ok) throw new Error(payload.error); setAccount(payload.account); setStatus("idle"); }).catch((error) => { setNotice({ type: "error", message: error.message || "This invitation is invalid." }); setStatus("error"); });
  }, [token]);
  function update(event) { const { name, value } = event.target; setForm((current) => ({ ...current, [name]: value })); }
  async function submit(event) {
    event.preventDefault(); setStatus("submitting"); setNotice(null);
    const response = await fetch("/api/admin/account-activation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, ...form }) });
    const payload = await response.json();
    if (!response.ok) { setNotice({ type: "error", message: payload.error || "Unable to activate this account." }); setStatus("idle"); return; }
    setNotice({ type: "success", message: payload.message }); setStatus("complete");
  }
  return <section className="admin-login-card"><p className="section-kicker">Account Invitation</p><h1>Activate Account</h1><p>{account ? `${account.name}, choose a secure password for ${account.email}.` : "Validating your invitation..."}</p>{notice ? <div className={`notice ${notice.type}`}>{notice.message}</div> : null}{status === "idle" || status === "submitting" ? <form onSubmit={submit}><div className="admin-field"><label htmlFor="invite-password">Password</label><input id="invite-password" name="password" type="password" minLength={10} value={form.password} onChange={update} required autoComplete="new-password" /></div><div className="admin-field"><label htmlFor="invite-confirm">Confirm Password</label><input id="invite-confirm" name="confirmPassword" type="password" minLength={10} value={form.confirmPassword} onChange={update} required autoComplete="new-password" /></div><button className="btn-brand full-width" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Activating..." : "Activate Account"}</button></form> : null}<Link className="admin-auth-link" href="/admin/login">Go to sign in</Link></section>;
}

export default function ActivateAccountPage() { return <main className="admin-login-page"><Suspense fallback={<section className="admin-login-card">Loading...</section>}><ActivationForm /></Suspense></main>; }
