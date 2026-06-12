"use client";

import { useEffect, useRef, useState } from "react";
import LiveConversationStatus from "@/components/LiveConversationStatus.jsx";
import ChatTimestamp from "@/components/ChatTimestamp.jsx";
import { useLiveEnquiryMessages } from "@/hooks/useLiveEnquiryMessages.js";

export default function PublicEnquiryThread({ token, enquiry, initialMessages }) {
  const encodedToken = encodeURIComponent(token);
  const { messages, addMessage, connection } = useLiveEnquiryMessages(`/api/enquiries/thread/${encodedToken}/stream`, initialMessages);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const conversationScroll = useRef(null);
  const previousMessageCount = useRef(initialMessages.length);

  useEffect(() => {
    if (messages.length > previousMessageCount.current) {
      conversationScroll.current?.scrollTo({ top: conversationScroll.current.scrollHeight, behavior: "smooth" });
    }
    previousMessageCount.current = messages.length;
  }, [messages.length]);

  async function submit(event) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const response = await fetch(`/api/enquiries/thread/${encodedToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body })
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Unable to send your reply.");
      setStatus("idle");
      return;
    }
    addMessage(payload.message);
    setBody("");
    setStatus("idle");
  }

  return (
    <main className="public-thread-page">
      <section className="shell public-thread-shell">
        <div className="public-thread-heading">
          <div className="conversation-title-row">
            <div>
              <p className="section-kicker">Private Conversation</p>
              <h1>{enquiry.serviceInterest || "Your enquiry"}</h1>
            </div>
            <LiveConversationStatus status={connection} />
          </div>
          <p>Hello {enquiry.fullName}. Continue your conversation with the Ephata team here.</p>
        </div>
        <div className="public-thread-panel">
          <div className="conversation-list public-conversation-list" aria-live="polite" ref={conversationScroll}>
            {messages.map((message) => (
              <article className={`conversation-message ${message.direction}`} key={message.id}>
                <div>
                  <strong>{message.direction === "outbound" ? "Ephata Concepts" : "You"}</strong>
                  <span><ChatTimestamp value={message.createdAt} /></span>
                </div>
                <p>{message.body}</p>
              </article>
            ))}
          </div>
          {error ? <div className="notice error">{error}</div> : null}
          <form onSubmit={submit}>
            <div className="form-field">
              <label htmlFor="client-reply">Your reply</label>
              <textarea id="client-reply" rows={5} value={body} onChange={(event) => setBody(event.target.value)} required />
            </div>
            <button className="btn-brand" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send Reply"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
