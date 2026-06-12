"use client";

import Link from "next/link";

export default function DataTable({
  columns,
  rows,
  onEdit,
  onDelete,
  getEditHref,
  canEditRow = () => true,
  canDeleteRow = () => true,
  emptyMessage = "No records yet."
}) {
  if (!rows.length) {
    return <div className="admin-empty">{emptyMessage}</div>;
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            <th>State</th>
            {getEditHref || onEdit || onDelete ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
              ))}
              <td>
                <span className={row.published === false ? "status-badge muted" : "status-badge success"}>
                  {row.published === false ? "Draft" : "Published"}
                </span>
              </td>
              {getEditHref || onEdit || onDelete ? (
                <td>
                  <div className="table-actions">
                  {getEditHref && canEditRow(row) ? (
                    <Link className="btn-admin secondary" href={getEditHref(row)}>
                      Edit
                    </Link>
                  ) : onEdit ? (
                    <button type="button" className="btn-admin secondary" onClick={() => onEdit(row)}>
                      Edit
                    </button>
                  ) : null}
                  {onDelete && canDeleteRow(row) ? (
                    <button type="button" className="btn-admin danger" onClick={() => onDelete(row)}>
                      Delete
                    </button>
                  ) : null}
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
