"use client";

import { DEFAULT_SETTINGS, PUBLIC_NAV_ITEMS } from "@/lib/constants.js";
import TransitionLink from "@/components/common/TransitionLink.jsx";
import { useState } from "react";
import { resolveImageSource } from "@/lib/uploadUrls.js";
import SocialLinks from "@/components/public/SocialLinks.jsx";

export default function SiteFooter({ settings }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const siteSettings = { ...DEFAULT_SETTINGS, ...settings };
  const footerLogo = resolveImageSource(siteSettings.logoSecondary || siteSettings.logoPrimary);
  const showLogo = Boolean(footerLogo.src && !logoFailed);

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <TransitionLink href="/" className="footer-brand">
              {showLogo ? (
                <img
                  className="footer-logo-image"
                  src={footerLogo.src}
                  alt={siteSettings.siteName}
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                siteSettings.siteName
              )}
            </TransitionLink>
            <p>{siteSettings.tagline}</p>
            <SocialLinks settings={siteSettings} label="Follow our work" variant="footer" />
          </div>
          <div>
            <h2>Explore</h2>
            <ul>
              {PUBLIC_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <TransitionLink href={item.href}>{item.label}</TransitionLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Services</h2>
            <ul>
              <li>Planning</li>
              <li>Coordination</li>
              <li>Guest flow</li>
              <li>Vendor care</li>
            </ul>
          </div>
          <div>
            <h2>Contact</h2>
            <address>
              {siteSettings.location}
              <br />
              <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
              <br />
              <a href={`tel:${String(siteSettings.phone || "").replace(/\s/g, "")}`}>
                {siteSettings.phone}
              </a>
            </address>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ephata Concepts. All rights reserved.</span>
          <span>Excellence · Timeliness · Accountability</span>
        </div>
      </div>
    </footer>
  );
}
