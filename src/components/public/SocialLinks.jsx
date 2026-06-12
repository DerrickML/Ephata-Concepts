import SocialIcon from "@/components/common/SocialIcon.jsx";
import { resolveSocialLinks } from "@/lib/socialLinks.js";

export default function SocialLinks({ settings, label = "Connect with us", variant = "default" }) {
  const links = resolveSocialLinks(settings).filter((link) => link.enabled);
  if (!links.length) return null;

  return (
    <div className={`social-links social-links-${variant}`}>
      <span className="social-links-label">{label}</span>
      <div className="social-links-list">
        {links.map((link) => (
          <a
            href={link.url}
            key={link.id}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.label} (opens in a new tab)`}
            title={link.label}
          >
            <SocialIcon name={link.icon} size={18} aria-hidden="true" />
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
