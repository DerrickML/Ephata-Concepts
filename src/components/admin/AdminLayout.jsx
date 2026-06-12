"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { AdminAccessProvider } from "./AdminAccessContext.jsx";
import AdminNav from "./AdminNav.jsx";

export default function AdminLayout({ children, currentUser }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setSidebarCollapsed(window.localStorage.getItem("ephata-admin-sidebar") === "collapsed");
  }, []);

  useEffect(() => {
    window.localStorage.setItem("ephata-admin-sidebar", sidebarCollapsed ? "collapsed" : "expanded");
  }, [sidebarCollapsed]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = mobileNavOpen ? "hidden" : previousOverflow;
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileNavOpen]);

  return (
    <AdminAccessProvider user={currentUser}>
      <div
      className={[
        "admin-shell",
        sidebarCollapsed ? "is-sidebar-collapsed" : "",
        mobileNavOpen ? "is-mobile-nav-open" : ""
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="admin-mobile-bar">
        <button
          type="button"
          className="admin-icon-button"
          aria-label="Open admin navigation"
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu size={20} aria-hidden="true" />
        </button>
        <span>Ephata Admin</span>
      </div>
      <button
        type="button"
        className="admin-nav-backdrop"
        aria-label="Close admin navigation"
        onClick={() => setMobileNavOpen(false)}
      />
      <AdminNav
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
        onCloseMobile={() => setMobileNavOpen(false)}
      />
        <main className="admin-main">{children}</main>
      </div>
    </AdminAccessProvider>
  );
}
