import { ArrowRight } from "lucide-react";
import TransitionLink from "./TransitionLink.jsx";

export default function ButtonLink({ href, children, variant = "primary", className = "" }) {
  const classes = variant === "secondary" ? "btn-outline-brand" : "btn-brand";
  return (
    <TransitionLink className={`${classes} ${className}`} href={href}>
      <span>{children}</span>
      <ArrowRight size={17} aria-hidden="true" />
    </TransitionLink>
  );
}
