"use client";

import { useEffect, useState } from "react";
import { useCan } from "@/components/admin/AdminAccessContext.jsx";

function valueToField(field, value) {
  if (field.type === "list") {
    return Array.isArray(value) ? value.join("\n") : "";
  }
  if (field.type === "prep-list") {
    return Array.isArray(value)
      ? value.map((item) => `${item.label || ""} | ${item.text || ""}`).join("\n")
      : "";
  }
  if (field.type === "stats-list") {
    return Array.isArray(value)
      ? value.map((item) => `${item.value || ""} | ${item.label || ""} | ${item.text || ""}`).join("\n")
      : "";
  }
  return value || "";
}

function fieldToValue(field, value) {
  if (field.type === "list") {
    return String(value || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (field.type === "prep-list") {
    return String(value || "")
      .split("\n")
      .map((line) => {
        const [label, ...text] = line.split("|");
        return {
          label: String(label || "").trim(),
          text: text.join("|").trim()
        };
      })
      .filter((item) => item.label || item.text);
  }
  if (field.type === "stats-list") {
    return String(value || "")
      .split("\n")
      .map((line) => {
        const [statValue, label, ...text] = line.split("|");
        return {
          value: String(statValue || "").trim(),
          label: String(label || "").trim(),
          text: text.join("|").trim()
        };
      })
      .filter((item) => item.value || item.label || item.text);
  }
  return value;
}

export default function AdminPageContentForm({
  title,
  eyebrow,
  description,
  endpoint,
  publicHref,
  fields,
  embedded = false
}) {
  const canEdit = useCan("settings", "edit");
  const [form, setForm] = useState({});
  const [status, setStatus] = useState("loading");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const response = await fetch(endpoint);
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error || "Failed to load page content.");
        setStatus("error");
        return;
      }
      const next = {};
      fields.forEach((field) => {
        next[field.name] = valueToField(field, payload.page?.[field.name]);
      });
      setForm(next);
      setStatus("idle");
    }
    load();
  }, [endpoint, fields]);

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setStatus("saving");
    setNotice("");
    setError("");

    const body = {};
    fields.forEach((field) => {
      body[field.name] = fieldToValue(field, form[field.name]);
    });

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Save failed.");
      setStatus("idle");
      return;
    }

    const next = {};
    fields.forEach((field) => {
      next[field.name] = valueToField(field, payload.page?.[field.name]);
    });
    setForm(next);
    setNotice("Page content updated.");
    setStatus("idle");
  }

  if (status === "loading") {
    return <div className="admin-empty">Loading page content...</div>;
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
                <label htmlFor={`page-${field.name}`}>{field.label}</label>
                {field.help ? <p className="admin-field-help">{field.help}</p> : null}
                {field.type === "textarea" || field.type === "list" || field.type === "prep-list" || field.type === "stats-list" ? (
                  <textarea
                    id={`page-${field.name}`}
                    name={field.name}
                    rows={field.rows || 4}
                    value={form[field.name] || ""}
                    onChange={(event) => setField(field.name, event.target.value)}
                    disabled={!canEdit}
                  />
                ) : field.type === "select" ? (
                  <select
                    id={`page-${field.name}`}
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={(event) => setField(field.name, event.target.value)}
                    disabled={!canEdit}
                  >
                    {(field.options || []).map((option) => {
                      const optionValue = typeof option === "object" ? option.value : option;
                      const optionLabel = typeof option === "object" ? option.label : option;
                      return (
                        <option value={optionValue} key={optionValue}>
                          {optionLabel}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <input
                    id={`page-${field.name}`}
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={(event) => setField(field.name, event.target.value)}
                    disabled={!canEdit}
                  />
                )}
              </div>
            ))}
            <div className="button-row">
              {canEdit ? <button className="btn-brand" type="submit" disabled={status === "saving"}>{status === "saving" ? "Saving..." : "Save Page"}</button> : null}
              {!embedded && publicHref ? (
                <a className="btn-admin secondary" href={publicHref}>
                  View Public Page
                </a>
              ) : null}
            </div>
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
          <p className="section-kicker">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {formContent}
      </section>
    </div>
  );
}
