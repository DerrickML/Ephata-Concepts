"use client";

import { ACCESS_LEVELS, ADMIN_SECTIONS, permissionLevel } from "@/lib/accessControl.js";

export default function PermissionsMatrix({ mode = "profile", value, onChange, disabled = false }) {
  function setProfileLevel(section, level) {
    onChange({ ...value, [section.key]: level === "custom" ? value[section.key] || [] : ACCESS_LEVELS[level] || [] });
  }

  function toggleProfileAction(section, action) {
    const current = new Set(value[section.key] || []);
    if (current.has(action)) current.delete(action);
    else current.add(action);
    onChange({ ...value, [section.key]: section.actions.filter((entry) => current.has(entry)) });
  }

  function setOverride(section, action, state) {
    const current = value[section.key] || { allow: [], deny: [] };
    const allow = new Set(current.allow || []);
    const deny = new Set(current.deny || []);
    allow.delete(action);
    deny.delete(action);
    if (state === "allow") allow.add(action);
    if (state === "deny") deny.add(action);
    onChange({ ...value, [section.key]: { allow: [...allow], deny: [...deny] } });
  }

  return (
    <div className="permission-matrix">
      {ADMIN_SECTIONS.map((section) => (
        <section className="permission-row" key={section.key}>
          <div className="permission-row-heading">
            <div>
              <strong>{section.label}</strong>
              <small>{section.actions.join(" · ")}</small>
            </div>
            {mode === "profile" ? (
              <select
                aria-label={`${section.label} access level`}
                value={permissionLevel(value[section.key], section.key)}
                onChange={(event) => setProfileLevel(section, event.target.value)}
                disabled={disabled}
              >
                <option value="none">No access</option>
                <option value="view">View only</option>
                <option value="contributor">Contributor</option>
                <option value="manager">Manager</option>
                <option value="custom">Custom</option>
              </select>
            ) : null}
          </div>
          <div className="permission-actions">
            {section.actions.map((action) => mode === "profile" ? (
              <label key={action}>
                <input
                  type="checkbox"
                  checked={(value[section.key] || []).includes(action)}
                  onChange={() => toggleProfileAction(section, action)}
                  disabled={disabled}
                />
                <span>{action}</span>
              </label>
            ) : (
              <label className="permission-override" key={action}>
                <span>{action}</span>
                <select
                  value={(value[section.key]?.allow || []).includes(action) ? "allow" : (value[section.key]?.deny || []).includes(action) ? "deny" : "inherit"}
                  onChange={(event) => setOverride(section, action, event.target.value)}
                  disabled={disabled}
                  aria-label={`${section.label} ${action} override`}
                >
                  <option value="inherit">Inherit</option>
                  <option value="allow">Allow</option>
                  <option value="deny">Deny</option>
                </select>
              </label>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
