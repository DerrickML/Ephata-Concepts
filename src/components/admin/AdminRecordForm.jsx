"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminField, initialValue, valueForEdit } from "./AdminRecordFields.jsx";

export default function AdminRecordForm({
  collection,
  apiPath,
  title,
  description,
  fields,
  item = null,
  indexPath
}) {
  const router = useRouter();
  const isEditing = Boolean(item);
  const [form, setForm] = useState(() => (isEditing ? valueForEdit(item, fields) : initialValue(fields)));
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setStatus("saving");
    setError("");

    const baseApiPath = apiPath || `/api/admin/${collection}`;
    const response = await fetch(isEditing ? `${baseApiPath}/${item.id}` : baseApiPath, {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Save failed.");
      setStatus("idle");
      return;
    }

    router.push(indexPath);
    router.refresh();
  }

  return (
    <section>
      <div className="admin-page-header">
        <p className="section-kicker">{isEditing ? "Edit Content" : "Create Content"}</p>
        <h1>{isEditing ? `Edit ${title}` : `New ${title}`}</h1>
        <p>{description}</p>
      </div>
      {error ? <div className="notice error">{error}</div> : null}
      <div className="admin-form-card wide">
        <div className="admin-panel-body">
          <form onSubmit={submit}>
            {fields.map((field) => (
              <AdminField
                key={field.name}
                collection={collection}
                field={field}
                value={form[field.name]}
                scope={isEditing ? item.id : "new"}
                onChange={(value) => setField(field.name, value)}
              />
            ))}
            <div className="button-row">
              <button className="btn-brand" type="submit" disabled={status === "saving"}>
                {status === "saving" ? "Saving…" : isEditing ? "Save Changes" : "Create Record"}
              </button>
              <Link className="btn-admin secondary" href={indexPath}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
