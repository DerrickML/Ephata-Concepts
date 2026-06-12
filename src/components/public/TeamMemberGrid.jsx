"use client";

import { useEffect, useState, ViewTransition } from "react";
import { X } from "lucide-react";
import TeamAvatar from "./TeamAvatar.jsx";

function teamGridClassName(count) {
  const remainder = count % 4;
  return [
    "team-grid",
    remainder === 2 ? "team-grid-remainder-2" : "",
    remainder === 3 ? "team-grid-remainder-3" : ""
  ]
    .filter(Boolean)
    .join(" ");
}

export default function TeamMemberGrid({ members = [] }) {
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (!selectedMember) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setSelectedMember(null);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedMember]);

  function openMember(member) {
    setSelectedMember(member);
  }

  function handleCardKeyDown(event, member) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMember(member);
    }
  }

  return (
    <>
      <div className={teamGridClassName(members.length)}>
        {members.map((member) => (
          <ViewTransition key={member.id}>
            <article
              className="team-card team-card-interactive"
              role="button"
              tabIndex={0}
              aria-label={`View ${member.name} profile`}
              onClick={() => openMember(member)}
              onKeyDown={(event) => handleCardKeyDown(event, member)}
            >
              <TeamAvatar member={member} className="team-card-avatar" />
              <div className="team-card-copy">
                <p className="card-category">{member.categoryName}</p>
                <h3>{member.name}</h3>
                <strong>{member.role}</strong>
                <span className="team-card-cta">View profile</span>
              </div>
            </article>
          </ViewTransition>
        ))}
      </div>

      {selectedMember ? (
        <ViewTransition enter="fade-in" exit="fade-out" default="none">
          <div
            className="team-modal-overlay"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedMember(null);
              }
            }}
          >
            <section
              className="team-modal-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="team-modal-title"
            >
              <button
                className="team-modal-close"
                type="button"
                aria-label="Close profile"
                onClick={() => setSelectedMember(null)}
              >
                <X size={19} aria-hidden="true" />
              </button>
              <TeamAvatar member={selectedMember} className="team-modal-avatar" />
              <div className="team-modal-copy">
                <p className="card-category">{selectedMember.categoryName}</p>
                <h2 id="team-modal-title" className="heading-serif">
                  {selectedMember.name}
                </h2>
                <strong>{selectedMember.role}</strong>
                <p>{selectedMember.bio || "Profile details are being prepared."}</p>
              </div>
            </section>
          </div>
        </ViewTransition>
      ) : null}
    </>
  );
}
