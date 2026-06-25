"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Newspaper,
  PackageCheck,
  Settings2,
  Sparkles,
  UserCog,
  UsersRound,
  X
} from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/lib/constants.js";
import { useAdminAccess } from "./AdminAccessContext.jsx";

const iconByHref = {
  "/admin/dashboard": LayoutDashboard,
  "/admin/services": Sparkles,
  "/admin/packages": PackageCheck,
  "/admin/portfolio": Images,
  "/admin/gallery": Images,
  "/admin/testimonials": MessageSquareQuote,
  "/admin/insights": Newspaper,
  "/admin/team": UsersRound,
  "/admin/enquiries": Inbox,
  "/admin/settings": Settings2,
  "/admin/users": UserCog
};

export default function AdminNav({ collapsed = false, onToggleCollapsed, onCloseMobile }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = useAdminAccess();
  const visibleItems = ADMIN_NAV_ITEMS.filter(
    (item) => !item.section || currentUser.permissions?.[item.section]?.includes("view")
  );

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="admin-sidebar" aria-label="Admin sidebar">
      <div className="admin-sidebar-head">
        <Link href="/admin/dashboard" className="admin-brand" onClick={onCloseMobile}>
          <span className="admin-brand-mark">
            <LayoutDashboard size={20} aria-hidden="true" />
          </span>
          <span className="admin-brand-copy">
            <strong>Ephata</strong>
            <small>Admin Console</small>
          </span>
        </Link>
        <button
          type="button"
          className="admin-sidebar-toggle"
          aria-label={collapsed ? "Expand admin navigation" : "Collapse admin navigation"}
          aria-pressed={collapsed}
          onClick={onToggleCollapsed}
        >
          {collapsed ? <ChevronRight size={18} aria-hidden="true" /> : <ChevronLeft size={18} aria-hidden="true" />}
        </button>
        <button type="button" className="admin-sidebar-close" aria-label="Close admin navigation" onClick={onCloseMobile}>
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <nav className="admin-nav-list" aria-label="Admin navigation">
        {visibleItems.map((item) => {
          const Icon = iconByHref[item.href] || LayoutDashboard;
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "admin-nav-link active" : "admin-nav-link"}
              title={item.label}
              onClick={onCloseMobile}
            >
              <span className="admin-nav-icon">
                <Icon size={19} aria-hidden="true" />
              </span>
              <span className="admin-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="admin-sidebar-footer">
        <Link className="admin-user-summary" href="/admin/change-password" title={`${currentUser.name} · ${currentUser.accessProfileName} · Change password`} onClick={onCloseMobile}>
          <span>{currentUser.name?.slice(0, 1).toUpperCase()}</span>
          <div className="admin-nav-label">
            <strong>{currentUser.name}</strong>
            <small>{currentUser.accessProfileName}</small>
          </div>
        </Link>
        <button type="button" className="admin-logout" title="Logout" onClick={logout}>
          <span className="admin-nav-icon">
            <LogOut size={18} aria-hidden="true" />
          </span>
          <span className="admin-nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
