"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, MailWarning, RefreshCw, Send, ShieldCheck } from "lucide-react";
import { useCan } from "./AdminAccessContext.jsx";

const EMPTY = {
  smtpHost: "",
  smtpPort: 587,
  smtpSecure: false,
  smtpUsername: "",
  smtpPassword: "",
  fromName: "Ephata Concepts",
  fromEmail: "",
  replyTo: "",
  enquiryNotificationsEnabled: true,
  accountInvitationsEnabled: true,
  passwordResetEnabled: false
};

export default function AdminEmailSettingsForm() {
  const canEdit = useCan("settings", "edit");
  const [form, setForm] = useState(EMPTY);
  const [runtime, setRuntime] = useState({});
  const [outbox, setOutbox] = useState([]);
  const [status, setStatus] = useState("loading");
  const [notice, setNotice] = useState(null);

  const load = useCallback(async () => {
    const [settingsResponse, outboxResponse] = await Promise.all([
      fetch("/api/admin/email-settings"),
      fetch("/api/admin/email-outbox")
    ]);
    const [settingsPayload, outboxPayload] = await Promise.all([settingsResponse.json(), outboxResponse.json()]);
    if (!settingsResponse.ok) throw new Error(settingsPayload.error || "Unable to load email settings.");
    const settings = settingsPayload.settings;
    setRuntime(settings);
    setForm((current) => ({ ...current, ...settings, smtpPassword: "" }));
    setOutbox(outboxResponse.ok ? outboxPayload.items || [] : []);
    setStatus("idle");
  }, []);

  useEffect(() => {
    load().catch((error) => {
      setNotice({ type: "error", message: error.message });
      setStatus("error");
    });
  }, [load]);

  function update(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  async function save(event) {
    event.preventDefault();
    setStatus("saving");
    setNotice(null);
    const response = await fetch("/api/admin/email-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const payload = await response.json();
    if (!response.ok) {
      setNotice({ type: "error", message: payload.error || "Unable to save email settings." });
      setStatus("idle");
      return;
    }
    setRuntime(payload.settings);
    setForm((current) => ({ ...current, ...payload.settings, smtpPassword: "" }));
    setNotice({ type: "success", message: "Email settings saved. Verify the connection after changing delivery details." });
    setStatus("idle");
  }

  async function verify() {
    setStatus("verifying");
    setNotice(null);
    const response = await fetch("/api/admin/email-settings/verify", { method: "POST" });
    const payload = await response.json();
    if (!response.ok) {
      setNotice({ type: "error", message: payload.error || "SMTP verification failed." });
      setStatus("idle");
      return;
    }
    setRuntime(payload.settings);
    setForm((current) => ({ ...current, ...payload.settings, smtpPassword: "" }));
    setNotice({ type: "success", message: "SMTP connection verified. Email delivery is active." });
    setStatus("idle");
  }

  async function retry() {
    setStatus("retrying");
    const response = await fetch("/api/admin/email-outbox/retry", { method: "POST" });
    const payload = await response.json();
    if (!response.ok) setNotice({ type: "error", message: payload.error || "Unable to retry queued email." });
    else setNotice({ type: "success", message: `Retried ${payload.results.length} queued email${payload.results.length === 1 ? "" : "s"}.` });
    await load();
  }

  const counts = useMemo(() => outbox.reduce((result, item) => ({ ...result, [item.status]: (result[item.status] || 0) + 1 }), {}), [outbox]);

  if (status === "loading") return <div className="admin-empty">Loading email delivery settings...</div>;

  return (
    <div className="email-settings-stack">
      {notice ? <div className={`notice ${notice.type}`}>{notice.message}</div> : null}
      <div className="email-runtime-grid">
        <div className="email-runtime-card"><ShieldCheck size={19} /><span>Configuration</span><strong>{runtime.configured ? "Complete" : "Incomplete"}</strong></div>
        <div className="email-runtime-card"><CheckCircle2 size={19} /><span>Connection</span><strong>{runtime.verified ? "Verified" : "Not verified"}</strong></div>
        <div className="email-runtime-card"><Send size={19} /><span>Outbox</span><strong>{counts.pending || 0} pending</strong></div>
      </div>
      {!runtime.encryptionAvailable && runtime.passwordSource !== "environment" ? (
        <div className="notice warning">Set <code>EMAIL_SECRETS_KEY</code> before saving an SMTP password, or provide <code>SMTP_PASSWORD</code> through the server environment.</div>
      ) : null}
      {runtime.lastVerificationError ? <div className="notice error">Last verification: {runtime.lastVerificationError}</div> : null}
      <form className="admin-form-card wide" onSubmit={save}>
        <div className="admin-panel-body">
          <h2>SMTP Connection</h2>
          <div className="admin-form-grid">
            <div className="admin-field"><label htmlFor="smtp-host">SMTP Host</label><input id="smtp-host" name="smtpHost" value={form.smtpHost} onChange={update} disabled={!canEdit} placeholder="smtp.example.com" /></div>
            <div className="admin-field"><label htmlFor="smtp-port">Port</label><input id="smtp-port" name="smtpPort" type="number" min="1" max="65535" value={form.smtpPort} onChange={update} disabled={!canEdit} /></div>
            <div className="admin-field"><label htmlFor="smtp-user">Username</label><input id="smtp-user" name="smtpUsername" value={form.smtpUsername} onChange={update} disabled={!canEdit} autoComplete="off" /></div>
            <div className="admin-field"><label htmlFor="smtp-password">Password</label><input id="smtp-password" name="smtpPassword" type="password" value={form.smtpPassword} onChange={update} disabled={!canEdit || (!runtime.encryptionAvailable && runtime.passwordSource !== "environment")} placeholder={runtime.passwordConfigured ? "Stored securely - leave blank to keep" : "SMTP password"} autoComplete="new-password" /><p className="admin-field-help">The stored password is never returned to the browser.</p></div>
            <label className="admin-check admin-field-span"><input type="checkbox" name="smtpSecure" checked={Boolean(form.smtpSecure)} onChange={update} disabled={!canEdit} /><span>Use implicit TLS (normally port 465)</span></label>
          </div>
          <h2 className="admin-spaced">Sender Identity</h2>
          <div className="admin-form-grid">
            <div className="admin-field"><label htmlFor="from-name">Sender Name</label><input id="from-name" name="fromName" value={form.fromName} onChange={update} disabled={!canEdit} /></div>
            <div className="admin-field"><label htmlFor="from-email">Sender Email</label><input id="from-email" name="fromEmail" type="email" value={form.fromEmail} onChange={update} disabled={!canEdit} /></div>
            <div className="admin-field admin-field-span"><label htmlFor="reply-to">Reply-To Email</label><input id="reply-to" name="replyTo" type="email" value={form.replyTo} onChange={update} disabled={!canEdit} placeholder="Defaults to sender email" /></div>
          </div>
          <h2 className="admin-spaced">Automation</h2>
          <div className="email-toggle-list">
            <label className="admin-check"><input type="checkbox" name="enquiryNotificationsEnabled" checked={Boolean(form.enquiryNotificationsEnabled)} onChange={update} disabled={!canEdit} /><span><strong>Enquiry notifications</strong><small>Notify active users who can view enquiries.</small></span></label>
            <label className="admin-check"><input type="checkbox" name="accountInvitationsEnabled" checked={Boolean(form.accountInvitationsEnabled)} onChange={update} disabled={!canEdit} /><span><strong>Account invitations</strong><small>Let administrators invite new users to set their own password.</small></span></label>
            <label className="admin-check"><input type="checkbox" name="passwordResetEnabled" checked={Boolean(form.passwordResetEnabled)} onChange={update} disabled={!canEdit || !runtime.verified} /><span><strong>Self-service password reset</strong><small>{runtime.verified ? "Send a 10-minute one-time code by email." : "Verify SMTP before this can be enabled."}</small></span></label>
          </div>
          {canEdit ? <div className="button-row"><button className="btn-brand" type="submit" disabled={status !== "idle"}>{status === "saving" ? "Saving..." : "Save Settings"}</button><button className="btn-admin secondary" type="button" onClick={verify} disabled={status !== "idle"}>{status === "verifying" ? "Verifying..." : "Verify Connection"}</button></div> : null}
        </div>
      </form>
      <div className="admin-form-card wide">
        <div className="admin-panel-body">
          <div className="email-outbox-head"><div><h2>Email Outbox</h2><p className="admin-panel-intro">Delivery failures do not block account or enquiry operations.</p></div>{canEdit ? <button className="btn-admin secondary" type="button" onClick={retry} disabled={status !== "idle"}><RefreshCw size={16} /> {status === "retrying" ? "Retrying..." : "Retry Pending"}</button> : null}</div>
          {outbox.length ? <div className="email-outbox-list">{outbox.map((item) => <div className="email-outbox-item" key={item.id}><span className={`status-badge ${item.status === "sent" ? "success" : item.status === "failed" ? "warning" : "muted"}`}>{item.status}</span><div><strong>{item.subject}</strong><small>{item.to.join(", ")} · {new Date(item.createdAt).toLocaleString()}</small>{item.lastError ? <small className="email-error"><MailWarning size={13} /> {item.lastError}</small> : null}</div></div>)}</div> : <div className="admin-empty compact">No email has been queued yet.</div>}
        </div>
      </div>
    </div>
  );
}
