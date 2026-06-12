"use client";

import { useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import SocialIcon from "@/components/common/SocialIcon.jsx";
import { SOCIAL_ICON_OPTIONS } from "@/lib/socialLinks.js";

export default function SocialIconPicker({ id, value, onChange, disabled = false }) {
  const picker = useRef(null);
  const [query, setQuery] = useState("");
  const options = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return SOCIAL_ICON_OPTIONS;
    return SOCIAL_ICON_OPTIONS.filter((option) =>
      `${option.label} ${option.keywords}`.toLocaleLowerCase().includes(term)
    );
  }, [query]);
  const selected = SOCIAL_ICON_OPTIONS.find((option) => option.name === value) || SOCIAL_ICON_OPTIONS.at(-1);

  return (
    <details className="social-icon-picker" ref={picker}>
      <summary aria-label={`Choose icon. Current icon: ${selected.label}`}>
        <SocialIcon name={selected.name} size={18} aria-hidden="true" />
        <span>{selected.label}</span>
      </summary>
      <div className="social-icon-picker-popover">
        <label className="social-icon-search" htmlFor={`${id}-search`}>
          <Search size={16} aria-hidden="true" />
          <input
            id={`${id}-search`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search icons"
            disabled={disabled}
          />
        </label>
        <div className="social-icon-options" role="listbox" aria-label="Social icons">
          {options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={option.name === value}
              className={option.name === value ? "active" : ""}
              key={option.name}
              onClick={() => {
                onChange(option.name);
                if (picker.current) picker.current.open = false;
              }}
              disabled={disabled}
              title={option.label}
            >
              <SocialIcon name={option.name} size={18} aria-hidden="true" />
              <span>{option.label}</span>
            </button>
          ))}
          {options.length ? null : <p>No matching icons.</p>}
        </div>
      </div>
    </details>
  );
}
