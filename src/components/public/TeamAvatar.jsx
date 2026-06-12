import ArchImage from "./ArchImage.jsx";
import { teamInitials } from "@/lib/team.js";

export default function TeamAvatar({ member, className = "" }) {
  if (member?.photo) {
    return (
      <ArchImage
        src={member.photo}
        alt={`${member.name} portrait`}
        className={`team-avatar ${className}`}
      />
    );
  }

  return (
    <div className={`team-avatar team-avatar-fallback ${className}`} aria-label={`${member?.name || "Team member"} portrait placeholder`}>
      <span>{teamInitials(member?.name)}</span>
    </div>
  );
}
