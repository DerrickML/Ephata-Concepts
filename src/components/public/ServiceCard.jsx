"use client";

import { ViewTransition } from "react";
import { ArrowRight, CalendarCheck } from "lucide-react";
import TransitionLink from "@/components/common/TransitionLink.jsx";
import ArchImage from "./ArchImage.jsx";

export default function ServiceCard({ service }) {
  return (
    <article className="content-card service-card">
      {service.image ? (
        <ViewTransition name={`service-image-${service.id}`} share="morph" default="none">
          <ArchImage src={service.image} alt={service.title} className="card-media" />
        </ViewTransition>
      ) : (
        <div className="card-icon">
          <CalendarCheck size={20} aria-hidden="true" />
        </div>
      )}
      <p className="card-category">{service.categoryName}</p>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <div className="card-footer-line">
        <span>{service.rate || "Custom Quote"}</span>
        <TransitionLink href={`/services/${service.slug}`} aria-label={`View ${service.title}`}>
          <ArrowRight size={18} aria-hidden="true" />
        </TransitionLink>
      </div>
    </article>
  );
}
