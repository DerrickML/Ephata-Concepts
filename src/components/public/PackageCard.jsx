"use client";

import { Check } from "lucide-react";
import TransitionLink from "@/components/common/TransitionLink.jsx";
import ArchImage from "./ArchImage.jsx";

export default function PackageCard({ item }) {
  const isWedding =
    item.categoryName?.toLowerCase().includes("wedding") ||
    item.categoryName?.toLowerCase().includes("celebration") ||
    item.categoryName?.toLowerCase().includes("personal");

  return (
    <article className={`content-card package-card ${isWedding ? "is-wedding" : ""}`}>
      {item.image ? <ArchImage src={item.image} alt={item.name} className="card-media" /> : null}
      <p className="card-category">{item.categoryName}</p>
      <h3>{item.name}</h3>
      <p className="price-line">{item.priceRange}</p>
      <p>{item.description}</p>
      <ul className="feature-list">
        {(item.features || []).slice(0, 3).map((feature) => (
          <li key={feature}>
            <Check size={16} aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <TransitionLink className="text-link" href="/book-consultation">
        {item.cta || "Book Consultation"}
      </TransitionLink>
    </article>
  );
}
