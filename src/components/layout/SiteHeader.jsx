"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import TransitionLink from "@/components/common/TransitionLink.jsx";
import { PUBLIC_NAV_ITEMS } from "@/lib/constants.js";
import { resolveImageSource } from "@/lib/uploadUrls.js";

export default function SiteHeader({ settings }) {
  const [open, setOpen] = useState(false);
  const [iconFailed, setIconFailed] = useState(false);
  const siteName = settings?.siteName || "Ephata Concepts";
  const icon = resolveImageSource(settings?.icon);
  const markSrc = iconFailed ? "/brand-icon.png" : icon.src || "/brand-icon.png";

  return (
    <header className="site-header">
      <div className="site-navbar shell">
        <TransitionLink href="/" className="brand-lockup" onClick={() => setOpen(false)}>
          <img
            className="brand-mark"
            src={markSrc}
            alt=""
            onError={() => setIconFailed(true)}
          />
          <span className="text-logo" aria-label={siteName}>
            <span>Ephata</span>
            <small>Concepts</small>
          </span>
        </TransitionLink>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label="Toggle navigation"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
        <nav id="main-navigation" className={`site-nav ${open ? "is-open" : ""}`}>
          {PUBLIC_NAV_ITEMS.map((item) => (
            <TransitionLink href={item.href} key={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </TransitionLink>
          ))}
          <TransitionLink className="btn-brand nav-cta" href="/book-consultation" onClick={() => setOpen(false)}>
            Book Consultation
          </TransitionLink>
        </nav>
      </div>
    </header>
  );
}
