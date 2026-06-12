import "./globals.css";
import { Figtree } from "next/font/google";
import SiteChrome from "@/components/layout/SiteChrome.jsx";
import { DEFAULT_SITE_DESCRIPTION, DEFAULT_SITE_TITLE } from "@/lib/constants.js";
import { readCollection } from "@/lib/jsonStore.js";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap"
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: DEFAULT_SITE_TITLE,
    template: "%s | Ephata Concepts"
  },
  description: DEFAULT_SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.svg"
  },
  openGraph: {
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
    type: "website"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1
};

export default async function RootLayout({ children }) {
  const settings = await readCollection("settings");

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={figtree.variable}>
        <SiteChrome settings={settings}>{children}</SiteChrome>
      </body>
    </html>
  );
}
