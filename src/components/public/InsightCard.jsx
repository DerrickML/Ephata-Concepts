"use client";

import { ViewTransition } from "react";
import TransitionLink from "@/components/common/TransitionLink.jsx";
import ArchImage from "./ArchImage.jsx";

export default function InsightCard({ post, headingLevel = "h2", compact = false }) {
  const Heading = headingLevel;

  return (
    <article className={`insight-card${compact ? " insight-card-compact" : ""}`}>
      {post.coverImage ? (
        <ViewTransition name={`insight-image-${post.id}`} share="morph" default="none">
          <ArchImage src={post.coverImage} alt={post.title} className="insight-media" />
        </ViewTransition>
      ) : null}
      <p className="card-category">
        {post.categoryName} · {post.publishedDate} · {post.author}
      </p>
      <Heading>{post.title}</Heading>
      <p>{post.excerpt}</p>
      <TransitionLink className="text-link" href={`/insights/${post.slug}`}>
        Read Insight
      </TransitionLink>
    </article>
  );
}
