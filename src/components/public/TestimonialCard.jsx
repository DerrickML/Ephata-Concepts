"use client";

import { Star, Quote } from "lucide-react";
import ArchImage from "./ArchImage.jsx";

export default function TestimonialCard({ item }) {
  return (
    <article className="testimonial-card">
      <div className="testimonial-card-top">
        {item.image ? (
          <ArchImage src={item.image} alt={item.clientName} className="testimonial-avatar" />
        ) : (
          <div className="card-icon">
            <Quote size={18} aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="rating-row" aria-label={`${item.rating || 5} out of 5 stars`}>
        {Array.from({ length: item.rating || 5 }).map((_, index) => (
          <Star key={index} size={15} fill="currentColor" aria-hidden="true" />
        ))}
      </div>
      <blockquote>“{item.quote}”</blockquote>
      <p className="testimonial-name">{item.clientName}</p>
      <p className="card-category">{item.clientRole}</p>
    </article>
  );
}
