"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useCan } from "@/components/admin/AdminAccessContext.jsx";
import SocialIconPicker from "@/components/admin/SocialIconPicker.jsx";
import { resolveSocialLinks } from "@/lib/socialLinks.js";

function createSocialLink() {
  return {
    id: `social-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: "",
    url: "",
    icon: "link",
    enabled: true
  };
}

export default function AdminSocialLinksForm() {
  const canEdit = useCan("settings", "edit");
  const [links, setLinks] = useState([]);
  const [status, setStatus] = useState("loading");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/settings");
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error || "Failed to load social links.");
        setStatus("error");
        return;
      }
      setLinks(resolveSocialLinks(payload.settings));
      setStatus("idle");
    }
    load();
  }, []);

  function updateLink(id, field, value) {
    setLinks((current) => current.map((link) => link.id === id ? { ...link, [field]: value } : link));
  }

  function moveLink(index, direction) {
    setLinks((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function submit(event) {
    event.preventDefault();
    setStatus("saving");
    setNotice("");
    setError("");
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ socialLinks: links })
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Unable to save social links. Check that each entry has a label and a complete URL.");
      setStatus("idle");
      return;
    }
    setLinks(resolveSocialLinks(payload.settings));
    setNotice("Social links updated.");
    setStatus("idle");
  }

  if (status === "loading") return <div className="admin-empty">Loading social links...</div>;

  return (
    <div className="admin-form-card wide social-settings-card">
      <div className="admin-panel-body">
        {notice ? <div className="notice success">{notice}</div> : null}
        {error ? <div className="notice error">{error}</div> : null}
        <form onSubmit={submit}>
          <div className="social-settings-toolbar">
            <div>
              <h3>Public social profiles</h3>
              <p>Enabled links appear in the footer, contact page, and consultation page.</p>
            </div>
            {canEdit ? (
              <button className="btn-admin secondary" type="button" onClick={() => setLinks((current) => [...current, createSocialLink()])} disabled={links.length >= 12}>
                <Plus size={17} aria-hidden="true" />
                Add Social Link
              </button>
            ) : null}
          </div>

          <div className="social-settings-list">
            {links.map((link, index) => (
              <fieldset className="social-settings-row" key={link.id} disabled={!canEdit}>
                <legend>Social link {index + 1}</legend>
                <div className="admin-field">
                  <label htmlFor={`social-label-${link.id}`}>Platform name</label>
                  <input id={`social-label-${link.id}`} value={link.label} onChange={(event) => updateLink(link.id, "label", event.target.value)} placeholder="Instagram" required />
                </div>
                <div className="admin-field social-url-field">
                  <label htmlFor={`social-url-${link.id}`}>Profile URL</label>
                  <input id={`social-url-${link.id}`} type="url" value={link.url} onChange={(event) => updateLink(link.id, "url", event.target.value)} placeholder="https://instagram.com/ephata" required />
                </div>
                <div className="admin-field">
                  <span className="admin-field-label">Icon</span>
                  <SocialIconPicker id={`social-icon-${link.id}`} value={link.icon} onChange={(value) => updateLink(link.id, "icon", value)} disabled={!canEdit} />
                </div>
                <label className="admin-check social-enabled-control">
                  <input type="checkbox" checked={link.enabled} onChange={(event) => updateLink(link.id, "enabled", event.target.checked)} />
                  <span>Visible publicly</span>
                </label>
                <div className="social-row-actions" aria-label={`Actions for ${link.label || `social link ${index + 1}`}`}>
                  <button type="button" title="Move up" aria-label="Move up" onClick={() => moveLink(index, -1)} disabled={index === 0}>
                    <ArrowUp size={17} aria-hidden="true" />
                  </button>
                  <button type="button" title="Move down" aria-label="Move down" onClick={() => moveLink(index, 1)} disabled={index === links.length - 1}>
                    <ArrowDown size={17} aria-hidden="true" />
                  </button>
                  <button className="danger" type="button" title="Remove" aria-label="Remove social link" onClick={() => setLinks((current) => current.filter((item) => item.id !== link.id))}>
                    <Trash2 size={17} aria-hidden="true" />
                  </button>
                </div>
              </fieldset>
            ))}
            {links.length ? null : <div className="admin-empty">No social profiles configured.</div>}
          </div>

          {canEdit ? <button className="btn-brand" type="submit" disabled={status === "saving"}>{status === "saving" ? "Saving..." : "Save Social Links"}</button> : null}
        </form>
      </div>
    </div>
  );
}
