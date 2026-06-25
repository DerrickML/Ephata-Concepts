"use client";

import Link from "next/link";
import { useState } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal.jsx";
import DataTable from "./DataTable.jsx";
import { useCan } from "./AdminAccessContext.jsx";

export default function AdminCollectionIndex({
  collection,
  apiPath,
  title,
  description,
  columns,
  items,
  createHref,
  editPathBase
}) {
  const sectionMap = {
    teamCategories: "team",
    teamMembers: "team",
    serviceCategories: "services",
    packageCategories: "packages",
    portfolioCategories: "portfolio",
    galleryAlbums: "gallery",
    insightCategories: "insights"
  };
  const isCategoryCollection = collection.endsWith("Categories");
  const section = sectionMap[collection] || collection;
  const canCreate = useCan(section, "create");
  const canEdit = useCan(section, "edit");
  const canDelete = useCan(section, "delete");
  const [rows, setRows] = useState(items);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [status, setStatus] = useState("idle");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function confirmDelete() {
    if (!deleteTarget) return;
    setStatus("deleting");
    setError("");
    setNotice("");

    const baseApiPath = apiPath || `/api/admin/${collection}`;
    const response = await fetch(`${baseApiPath}/${deleteTarget.id}`, {
      method: "DELETE"
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Delete failed.");
      setStatus("idle");
      return;
    }

    setRows((current) => current.filter((row) => row.id !== deleteTarget.id));
    setNotice(
      isCategoryCollection
        ? payload.reassignedCount
          ? `Category deleted. ${payload.reassignedCount} linked record(s) moved to Uncategorized.`
          : "Category deleted."
        : "Record deleted."
    );
    setDeleteTarget(null);
    setStatus("idle");
  }

  return (
    <section>
      <div className="admin-list-toolbar">
        <div className="admin-page-header">
          <p className="section-kicker">Manage Content</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {canCreate ? (
          <Link className="btn-brand" href={createHref}>
            New Record
          </Link>
        ) : null}
      </div>
      {notice ? <div className="notice success">{notice}</div> : null}
      {error ? <div className="notice error">{error}</div> : null}
      <DataTable
        rows={rows}
        columns={columns}
        getEditHref={canEdit ? (row) => `${editPathBase}/${encodeURIComponent(row.id)}/edit` : null}
        onDelete={canDelete ? setDeleteTarget : null}
        canEditRow={(row) => !row.system}
        canDeleteRow={(row) => !row.system}
        emptyMessage={`No ${title.toLowerCase()} records yet.`}
      />
      <ConfirmDeleteModal
        item={deleteTarget}
        label={title}
        busy={status === "deleting"}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        reassignToUncategorized={isCategoryCollection}
      />
    </section>
  );
}
