"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import TransitionLink from "@/components/common/TransitionLink.jsx";
import TeamAvatar from "./TeamAvatar.jsx";

export default function TeamSlider({ members = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = members.length > 1;
  const activeMember = members[activeIndex];

  useEffect(() => {
    if (!hasMultiple) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % members.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [hasMultiple, members.length]);

  if (!members.length) {
    return null;
  }

  function goTo(index) {
    setActiveIndex((index + members.length) % members.length);
  }

  return (
    <div className="team-slider">
      <div className="team-slider-stage" aria-live="polite">
        <TeamAvatar member={activeMember} className="team-slider-avatar" />
        <div className="team-slider-copy">
          <p className="card-category">{activeMember.categoryName}</p>
          <h3>{activeMember.name}</h3>
          <strong>{activeMember.role}</strong>
          {activeMember.bio ? <p>{activeMember.bio}</p> : null}
          <div className="team-slider-actions">
            <TransitionLink className="btn-brand" href="/team">
              View Team
            </TransitionLink>
            {hasMultiple ? (
              <div className="team-slider-controls" aria-label="Team slider controls">
                <button type="button" onClick={() => goTo(activeIndex - 1)} aria-label="Previous team member">
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => goTo(activeIndex + 1)} aria-label="Next team member">
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {hasMultiple ? (
        <div className="team-slider-rail" aria-label="Featured team members">
          {members.map((member, index) => (
            <button
              className={index === activeIndex ? "is-active" : ""}
              type="button"
              key={member.id}
              onClick={() => goTo(index)}
              aria-label={`Show ${member.name}`}
              aria-current={index === activeIndex}
            >
              <span>{member.name}</span>
              <small>{member.role}</small>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
