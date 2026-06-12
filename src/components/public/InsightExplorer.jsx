"use client";

import { useState } from "react";
import EmptyState from "@/components/common/EmptyState.jsx";
import InsightCard from "./InsightCard.jsx";

export default function InsightExplorer({ posts = [], categories = [] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const categoryFilters = categories
    .map((category) => ({
      ...category,
      count: posts.filter((post) => post.categoryId === category.id).length
    }))
    .filter((category) => category.count > 0);
  const visiblePosts = activeCategory === "all"
    ? posts
    : posts.filter((post) => post.categoryId === activeCategory);

  return (
    <div className="insight-explorer">
      <div className="insight-filter-row" aria-label="Filter insights by category">
        <button
          className={activeCategory === "all" ? "is-active" : ""}
          type="button"
          onClick={() => setActiveCategory("all")}
          aria-pressed={activeCategory === "all"}
        >
          <span>All</span>
          <small>{posts.length}</small>
        </button>
        {categoryFilters.map((category) => (
          <button
            className={activeCategory === category.id ? "is-active" : ""}
            type="button"
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            aria-pressed={activeCategory === category.id}
          >
            <span>{category.name}</span>
            <small>{category.count}</small>
          </button>
        ))}
      </div>

      <p className="insight-result-count" aria-live="polite">
        {visiblePosts.length} {visiblePosts.length === 1 ? "article" : "articles"}
      </p>

      {visiblePosts.length ? (
        <div className="insight-grid insight-filter-results" key={activeCategory}>
          {visiblePosts.map((post) => (
            <InsightCard post={post} key={post.id} />
          ))}
        </div>
      ) : (
        <EmptyState title="No insights in this category yet" />
      )}
    </div>
  );
}
