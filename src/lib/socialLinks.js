export const SOCIAL_ICON_OPTIONS = [
  { name: "camera", label: "Instagram", keywords: "photo camera social" },
  { name: "users", label: "Facebook", keywords: "community people social" },
  { name: "briefcase", label: "LinkedIn", keywords: "professional business work" },
  { name: "play", label: "YouTube", keywords: "video play channel" },
  { name: "at-sign", label: "X / Twitter", keywords: "x twitter post social" },
  { name: "music", label: "TikTok", keywords: "music short video" },
  { name: "message-circle", label: "WhatsApp", keywords: "chat message conversation" },
  { name: "send", label: "Telegram", keywords: "paper plane message" },
  { name: "pin", label: "Pinterest", keywords: "pin inspiration board" },
  { name: "messages", label: "Threads / Discord", keywords: "threads discord community chat" },
  { name: "radio", label: "Twitch", keywords: "stream live broadcast" },
  { name: "code", label: "GitHub", keywords: "code developer repository" },
  { name: "podcast", label: "Podcast", keywords: "audio show microphone" },
  { name: "video", label: "Video channel", keywords: "film watch media" },
  { name: "globe", label: "Website", keywords: "web globe site" },
  { name: "link", label: "Other link", keywords: "url external social" }
];

export const DEFAULT_SOCIAL_ICON = "link";

const SOCIAL_ICON_NAMES = new Set(SOCIAL_ICON_OPTIONS.map((option) => option.name));

export function normalizeSocialUrl(value) {
  const input = String(value || "").trim().slice(0, 2000);
  if (!input) return "";

  try {
    const url = new URL(input);
    if ((url.protocol === "http:" || url.protocol === "https:") && !url.username && !url.password) {
      return url.toString();
    }
  } catch {
    return "";
  }

  return "";
}

export function normalizeSocialLinks(value) {
  if (!Array.isArray(value)) return [];

  const usedIds = new Set();

  return value.slice(0, 12).flatMap((entry, index) => {
    const label = String(entry?.label || "").replace(/\s+/g, " ").trim().slice(0, 60);
    const url = normalizeSocialUrl(entry?.url);
    if (!label || !url) return [];

    const rawId = String(entry?.id || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 72);
    const baseId = rawId || `social-${index + 1}`;
    let id = baseId;
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(id);
    const icon = SOCIAL_ICON_NAMES.has(entry?.icon) ? entry.icon : DEFAULT_SOCIAL_ICON;

    return [{
      id,
      label,
      url,
      icon,
      enabled: entry?.enabled !== false
    }];
  });
}

export function resolveSocialLinks(settings) {
  const configured = normalizeSocialLinks(settings?.socialLinks);
  if (configured.length || settings?.socialLinksConfigured) return configured;

  return normalizeSocialLinks([
    { id: "instagram", label: "Instagram", url: settings?.instagram, icon: "camera", enabled: true },
    { id: "facebook", label: "Facebook", url: settings?.facebook, icon: "users", enabled: true },
    { id: "linkedin", label: "LinkedIn", url: settings?.linkedin, icon: "briefcase", enabled: true }
  ]);
}
