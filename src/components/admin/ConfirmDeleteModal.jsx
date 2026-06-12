"use client";

export default function ConfirmDeleteModal({ item, label, onCancel, onConfirm, busy, reassignToUncategorized = false }) {
  if (!item) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onCancel}>
      <section
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-delete-title">Delete {label}</h2>
        <p>
          This will remove{" "}
          <strong>{item.title || item.name || item.clientName || item.fullName || "this item"}</strong>{" "}
          from the JSON data store.
        </p>
        {reassignToUncategorized ? (
          <p>Linked records will be moved to <strong>Uncategorized</strong> before deletion.</p>
        ) : null}
        <div className="modal-actions">
          <button type="button" className="btn-admin secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn-admin danger solid" onClick={onConfirm} disabled={busy}>
            {busy ? "Deleting..." : "Delete"}
          </button>
        </div>
      </section>
    </div>
  );
}
