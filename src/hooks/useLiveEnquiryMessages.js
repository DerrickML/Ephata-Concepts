"use client";

import { useEffect, useState } from "react";

function mergeMessages(current, incoming) {
  const messages = new Map(current.map((message) => [message.id, message]));
  for (const message of incoming) messages.set(message.id, message);
  return [...messages.values()].sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
}

export function useLiveEnquiryMessages(streamUrl, initialMessages) {
  const [messages, setMessages] = useState(initialMessages);
  const [connection, setConnection] = useState("connecting");

  useEffect(() => {
    const source = new EventSource(streamUrl);

    function handleConnected() {
      setConnection("live");
    }

    function handleMessages(event) {
      try {
        const payload = JSON.parse(event.data);
        if (!Array.isArray(payload.messages)) return;
        setMessages((current) => mergeMessages(current, payload.messages));
        setConnection("live");
      } catch {
        setConnection("reconnecting");
      }
    }

    source.addEventListener("connected", handleConnected);
    source.addEventListener("messages", handleMessages);
    source.addEventListener("heartbeat", handleConnected);
    source.onerror = () => setConnection("reconnecting");

    return () => source.close();
  }, [streamUrl]);

  function addMessage(message) {
    setMessages((current) => mergeMessages(current, [message]));
  }

  return { messages, addMessage, connection };
}
