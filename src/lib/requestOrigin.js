function normalizedOrigin(value) {
  try {
    return new URL(String(value || "").trim()).origin;
  } catch {
    return "";
  }
}

function firstForwardedValue(value) {
  return String(value || "").split(",")[0].trim();
}

export function publicRequestOrigin(request) {
  const configuredOrigin = normalizedOrigin(
    process.env.APP_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL
  );
  if (configuredOrigin) return configuredOrigin;

  const forwardedHost = firstForwardedValue(request.headers.get("x-forwarded-host"));
  const forwardedProto = firstForwardedValue(request.headers.get("x-forwarded-proto"));
  if (forwardedHost && ["http", "https"].includes(forwardedProto)) {
    return normalizedOrigin(`${forwardedProto}://${forwardedHost}`);
  }

  return normalizedOrigin(request.url);
}

export function sameOrigin(request) {
  const origin = normalizedOrigin(request.headers.get("origin"));
  if (!origin) return true;

  const configuredOrigin = normalizedOrigin(
    process.env.APP_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL
  );
  if (configuredOrigin) return origin === configuredOrigin;

  const allowedOrigins = new Set([
    publicRequestOrigin(request),
    normalizedOrigin(request.url)
  ].filter(Boolean));

  return allowedOrigins.has(origin);
}
