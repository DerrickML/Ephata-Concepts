"use client";

import { useEffect, useState } from "react";
import { formatUtcTimestamp } from "@/lib/dateFormat.js";

export default function ChatTimestamp({ value }) {
  const [display, setDisplay] = useState(() => formatUtcTimestamp(value));

  useEffect(() => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return;
    setDisplay(new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short"
    }).format(date));
  }, [value]);

  return <time dateTime={value} title={formatUtcTimestamp(value)}>{display}</time>;
}
