"use client";

import { useEffect, useRef, useState } from "react";
import { Link2, Upload } from "lucide-react";
import { resolveImageSource } from "@/lib/uploadUrls.js";

export default function ImageUploader({ folder, value, onChange, id, name, disabled = false }) {
  const inputRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);
  const resolved = resolveImageSource(value);

  useEffect(() => {
    setPreviewFailed(false);
  }, [value]);

  async function upload(event) {
    if (disabled) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    setStatus("uploading");
    setError("");

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Upload failed. Choose a supported image and try again.");
      setStatus("error");
      return;
    }
    onChange(payload.path);
    setStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="image-uploader">
      {resolved.src && !previewFailed ? (
        <div className="image-uploader-preview">
          <img src={resolved.src} alt="" onError={() => setPreviewFailed(true)} />
        </div>
      ) : null}
      <div className="input-action-row">
        <span className="input-leading-icon" aria-hidden="true">
          <Link2 size={15} />
        </span>
        <input
          id={id}
          name={name}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          inputMode="url"
          autoComplete="off"
          placeholder="Upload, paste /images/name.webp, or paste https://..."
          disabled={disabled}
        />
        <button type="button" className="btn-admin secondary" onClick={() => inputRef.current?.click()} disabled={disabled || status === "uploading"}>
          {status === "uploading" ? "…" : <Upload size={16} aria-hidden="true" />}
          Upload File
        </button>
      </div>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        name={`${name || "image"}-file`}
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        onChange={upload}
        disabled={disabled}
      />
      <small>Use an uploaded path, a public `/images/...` path, or an image URL.</small>
      {error ? <div className="notice error">{error}</div> : null}
    </div>
  );
}
