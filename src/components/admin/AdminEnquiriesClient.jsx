"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCan } from "./AdminAccessContext.jsx";

export default function AdminEnquiriesClient() {
  const canEdit = useCan("enquiries", "edit");
  const canDelete = useCan("enquiries", "delete");
  const [items, setItems] = useState([]);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  async function load() {
    setStatus("loading");
    const response = await fetch("/api/admin/enquiries");
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Failed to load enquiries.");
      setStatus("error");
      return;
    }
    setItems(payload.items || []);
    setStatus("idle");
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id, nextStatus) {
    await fetch(`/api/admin/enquiries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus })
    });
    await load();
  }

  async function remove(id) {
    await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
    await load();
  }

  if (status === "loading") {
    return <div className="admin-empty">Loading enquiries...</div>;
  }

  const sourceCounts = {
    all: items.length,
    contact: items.filter((item) => item.source === "contact").length,
    consultation: items.filter((item) => (item.source || "consultation") === "consultation").length
  };
  const filteredItems =
    sourceFilter === "all"
      ? items
      : items.filter((item) => (item.source || "consultation") === sourceFilter);

  return (
    <section>
      <div className="admin-page-header">
        <p className="section-kicker">Client Enquiries</p>
        <h1>Enquiries</h1>
        <p>Review consultation and contact form submissions saved to the JSON store.</p>
      </div>
      {error ? <div className="notice error">{error}</div> : null}
      <div className="admin-filter-tabs" aria-label="Filter enquiries by source">
        {[
          { value: "all", label: "All" },
          { value: "contact", label: "Contact" },
          { value: "consultation", label: "Consultation" }
        ].map((option) => (
          <button
            type="button"
            key={option.value}
            className={sourceFilter === option.value ? "active" : ""}
            onClick={() => setSourceFilter(option.value)}
          >
            <span>{option.label}</span>
            <strong>{sourceCounts[option.value]}</strong>
          </button>
        ))}
      </div>
      {filteredItems.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Source</th>
                <th>Event</th>
                <th>Interest</th>
                <th>Message</th>
                <th>Status</th>
                <th>Conversation</th>
                {canDelete ? <th>Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.fullName}</strong>
                    <br />
                    <a href={`mailto:${item.email}`}>{item.email}</a>
                    <br />
                    <span>{item.phone}</span>
                  </td>
                  <td>
                    <span className={item.source === "contact" ? "status-badge muted" : "status-badge success"}>
                      {item.source === "contact" ? "contact" : "consultation"}
                    </span>
                  </td>
                  <td>
                    {item.eventType}
                    <br />
                    <span>{item.eventDate || "Date TBC"}</span>
                  </td>
                  <td>{item.serviceInterest}</td>
                  <td className="enquiry-message">{item.message}</td>
                  <td>
                    <span
                      className={
                        item.status === "new"
                          ? "status-badge warning"
                          : item.status === "archived"
                            ? "status-badge muted"
                            : "status-badge success"
                      }
                    >
                      {item.status}
                    </span>
                    {canEdit ? (
                      <select className="status-select" value={item.status} onChange={(event) => updateStatus(item.id, event.target.value)}>
                        <option value="new">new</option>
                        <option value="read">read</option>
                        <option value="archived">archived</option>
                      </select>
                    ) : null}
                  </td>
                  <td><Link className="btn-admin secondary" href={`/admin/enquiries/${item.id}`}>Open Thread</Link></td>
                  {canDelete ? <td><button type="button" className="btn-admin danger" onClick={() => remove(item.id)}>Delete</button></td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">
          {items.length ? "No enquiries match this filter." : "No enquiries yet."}
        </div>
      )}
    </section>
  );
}
