export function formatUtcTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.toISOString().replace("T", " ").slice(0, 16)} UTC`;
}
