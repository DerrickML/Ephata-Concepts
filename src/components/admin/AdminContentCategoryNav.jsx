"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderTree, List } from "lucide-react";

export default function AdminContentCategoryNav({ basePath, recordsLabel, categoriesLabel }) {
  const pathname = usePathname();
  const categoriesPath = `${basePath}/categories`;
  const categoryActive = pathname?.startsWith(categoriesPath);

  return (
    <nav className="admin-subnav" aria-label={`${recordsLabel} management`}>
      <Link className={!categoryActive ? "active" : ""} href={basePath}>
        <List size={17} aria-hidden="true" />
        <span>{recordsLabel}</span>
      </Link>
      <Link className={categoryActive ? "active" : ""} href={categoriesPath}>
        <FolderTree size={17} aria-hidden="true" />
        <span>{categoriesLabel}</span>
      </Link>
    </nav>
  );
}
