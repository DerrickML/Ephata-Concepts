"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTOR = [
  ".page-transition-wrapper .page-header-copy",
  ".page-transition-wrapper .section-header",
  ".page-transition-wrapper .story-panel",
  ".page-transition-wrapper .content-card",
  ".page-transition-wrapper .portfolio-card",
  ".page-transition-wrapper .testimonial-card",
  ".page-transition-wrapper .insight-card",
  ".page-transition-wrapper .process-steps li",
  ".page-transition-wrapper .team-slider",
  ".page-transition-wrapper .team-card",
  ".page-transition-wrapper .value-card",
  ".page-transition-wrapper .contact-hero-copy",
  ".page-transition-wrapper .contact-method-card",
  ".page-transition-wrapper .contact-response-card",
  ".page-transition-wrapper .booking-hero-copy",
  ".page-transition-wrapper .booking-visual-card",
  ".page-transition-wrapper .booking-prep-card",
  ".page-transition-wrapper .contact-panel",
  ".page-transition-wrapper .consultation-note",
  ".page-transition-wrapper .enquiry-form",
  ".page-transition-wrapper .arch-image",
  ".site-footer .footer-grid > *",
  ".site-footer .footer-bottom"
].join(", ");

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(REVEAL_SELECTOR));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    elements.forEach((element, index) => {
      element.classList.add("reveal-on-scroll");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 45}ms`);

      const isAlreadyVisible = element.getBoundingClientRect().top < window.innerHeight * 0.86;
      element.classList.toggle("is-revealed", prefersReducedMotion || isAlreadyVisible);
    });

    document.body.classList.add("has-scroll-reveal");

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-revealed"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -30% 0px",
        threshold: 0.22
      }
    );

    elements
      .filter((element) => !element.classList.contains("is-revealed"))
      .forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
