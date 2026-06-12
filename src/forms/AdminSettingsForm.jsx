"use client";

import { useEffect, useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader.jsx";
import { useCan } from "@/components/admin/AdminAccessContext.jsx";

const fields = [
  { name: "siteName", label: "Site Name", autoComplete: "organization" },
  { name: "tagline", label: "Tagline" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "location", label: "Location", autoComplete: "street-address" },
  { name: "logoPrimary", label: "Primary Logo or URL", type: "image" },
  { name: "logoSecondary", label: "Secondary Logo or URL", type: "image" },
  { name: "icon", label: "Icon or URL", type: "image" },
  { name: "heroImage", label: "Hero Image or URL", type: "image" },
  { name: "aboutImage", label: "About Image or URL", type: "image" },
  { name: "corporateImage", label: "Corporate Image or URL", type: "image" }
];

export default function AdminSettingsForm({ embedded = false }) {
  const canEdit = useCan("settings", "edit");
  const [settings, setSettings] = useState({});
  const [status, setStatus] = useState("loading");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/settings");
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error || "Failed to load settings.");
        setStatus("error");
        return;
      }
      setSettings(payload.settings || {});
      setStatus("idle");
    }
    load();
  }, []);

  function setField(name, value) {
    setSettings((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setStatus("saving");
    setNotice("");
    setError("");
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Save failed.");
      setStatus("idle");
      return;
    }
    setSettings(payload.settings);
    setNotice("Settings updated.");
    setStatus("idle");
  }

  if (status === "loading") {
    return <div className="admin-empty">Loading settings…</div>;
  }

  const formContent = (
    <>
      {notice ? <div className="notice success">{notice}</div> : null}
      {error ? <div className="notice error">{error}</div> : null}
      <div className="admin-form-card wide">
        <div className="admin-panel-body">
          <form onSubmit={submit}>
            {fields.map((field) => (
              <div className="admin-field" key={field.name}>
                <label htmlFor={`settings-${field.name}`}>{field.label}</label>
                {field.type === "image" ? (
                  <ImageUploader
                    id={`settings-${field.name}`}
                    name={field.name}
                    folder="brand"
                    value={settings[field.name] || ""}
                    onChange={(value) => setField(field.name, value)}
                    disabled={!canEdit}
                  />
                ) : field.type === "textarea" ? (
                  <textarea
                    id={`settings-${field.name}`}
                    name={field.name}
                    rows={4}
                    value={settings[field.name] || ""}
                    onChange={(event) => setField(field.name, event.target.value)}
                    autoComplete="off"
                    disabled={!canEdit}
                  />
                ) : (
                  <input
                    id={`settings-${field.name}`}
                    name={field.name}
                    type={field.type || "text"}
                    value={settings[field.name] || ""}
                    onChange={(event) => setField(field.name, event.target.value)}
                    autoComplete={field.autoComplete || "off"}
                    disabled={!canEdit}
                  />
                )}
              </div>
            ))}
            {canEdit ? <button className="btn-brand" type="submit" disabled={status === "saving"}>{status === "saving" ? "Saving…" : "Save Settings"}</button> : null}
          </form>
        </div>
      </div>
    </>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <div className="admin-page-grid single">
      <section>
        <div className="admin-page-header">
          <p className="section-kicker">Site Settings</p>
          <h1>Settings</h1>
          <p>Manage contact details, social links, brand images, and public fallback visuals.</p>
        </div>
        {formContent}
      </section>
    </div>
  );
}
