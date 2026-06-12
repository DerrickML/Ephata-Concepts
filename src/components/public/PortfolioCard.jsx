"use client";

import { ViewTransition } from "react";
import TransitionLink from "@/components/common/TransitionLink.jsx";
import ArchImage from "./ArchImage.jsx";

export default function PortfolioCard({ item }) {
  return (
    <article className="portfolio-card">
      <ViewTransition name={`portfolio-cover-${item.id}`} share="morph" default="none">
        <ArchImage src={item.coverImage} alt={item.title} className="portfolio-arch" />
      </ViewTransition>
      <div className="portfolio-content">
        <p className="card-category">
          {item.categoryName} · {item.location}
        </p>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <TransitionLink className="text-link" href={`/portfolio/${item.slug}`}>
          View Event
        </TransitionLink>
      </div>
    </article>
  );
}
