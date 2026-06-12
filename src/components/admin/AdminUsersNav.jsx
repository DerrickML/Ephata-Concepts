"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, ShieldCheck, Users } from "lucide-react";

const items = [
  { href: "/admin/users", label: "User Accounts", icon: Users, exact: true },
  { href: "/admin/users/access-profiles", label: "Access Profiles", icon: ShieldCheck },
  { href: "/admin/users/audit-log", label: "Audit Log", icon: History }
];

export default function AdminUsersNav() {
  const pathname = usePathname();
  return (
    <nav className="admin-subnav" aria-label="User management">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.exact ? pathname === item.href || pathname?.startsWith("/admin/users/new") || /^\/admin\/users\/[^/]+\/edit/.test(pathname) : pathname?.startsWith(item.href);
        return (
          <Link className={active ? "active" : ""} href={item.href} key={item.href}>
            <Icon size={17} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
