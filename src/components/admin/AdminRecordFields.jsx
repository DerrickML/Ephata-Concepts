"use client";

import dynamic from "next/dynamic";
import ImageUploader from "./ImageUploader.jsx";
import { createEmptyRichTextDocument } from "@/lib/richText.js";

const RichTextEditor = dynamic(() => import("@/components/ui/RichTextEditor.jsx"), {
  ssr: false,
  loading: () => <div className="rich-text-editor loading">Loading editor...</div>
});

export function initialValue(fields) {
  return fields.reduce((values, field) => {
    if (field.type === "checkbox") {
      values[field.name] = field.defaultValue ?? false;
    } else if (field.type === "richtext") {
      values[field.name] = field.defaultValue ?? createEmptyRichTextDocument();
    } else {
      values[field.name] = field.defaultValue ?? "";
    }
    return values;
  }, {});
}

export function valueForEdit(item, fields) {
  const values = initialValue(fields);
  for (const field of fields) {
    const value = item[field.name];
    values[field.name] = Array.isArray(value) ? value.join("\n") : value ?? values[field.name];
  }
  return values;
}

export function AdminField({ collection, field, value, onChange, scope = "record" }) {
  const id = `${collection}-${scope}-${field.name}`;

  if (field.type === "checkbox") {
    return (
      <div className="admin-field">
        <label className="checkbox-row" htmlFor={id}>
          <input
            id={id}
            name={field.name}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onChange(event.target.checked)}
          />
          <span>{field.help || field.label}</span>
        </label>
      </div>
    );
  }

  return (
    <div className="admin-field">
      <label htmlFor={id}>{field.label}</label>
      {field.type === "textarea" ? (
        <textarea
          id={id}
          name={field.name}
          rows={field.rows || 4}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          required={field.required}
        />
      ) : field.type === "select" ? (
        <select
          id={id}
          name={field.name}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          required={field.required}
        >
          <option value="">Select</option>
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
      ) : field.type === "image" ? (
        <ImageUploader
          id={id}
          name={field.name}
          folder={field.folder}
          value={value || ""}
          onChange={onChange}
        />
      ) : field.type === "richtext" ? (
        <RichTextEditor
          id={id}
          value={value}
          required={field.required}
          placeholder={field.placeholder}
          onChange={onChange}
        />
      ) : (
        <input
          id={id}
          name={field.name}
          type={field.type || "text"}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          required={field.required}
        />
      )}
      {field.help && field.type !== "checkbox" ? <small>{field.help}</small> : null}
    </div>
  );
}
