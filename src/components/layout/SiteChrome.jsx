"use client";

import { usePathname } from "next/navigation";
import ScrollReveal from "@/components/common/ScrollReveal.jsx";
import SiteHeader from "./SiteHeader.jsx";
import SiteFooter from "./SiteFooter.jsx";

export default function SiteChrome({ children, settings }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader settings={settings} />
      <main>
        {children}
      </main>
      <SiteFooter settings={settings} />
      <ScrollReveal />
    </>
  );
}
