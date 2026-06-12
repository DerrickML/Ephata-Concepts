import { Radio } from "lucide-react";

const LABELS = {
  connecting: "Connecting",
  live: "Live",
  reconnecting: "Reconnecting"
};

export default function LiveConversationStatus({ status }) {
  return (
    <span className={`live-conversation-status ${status}`} role="status" aria-live="polite">
      <Radio size={14} aria-hidden="true" />
      {LABELS[status] || "Connecting"}
    </span>
  );
}
