"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Mail, Send } from "lucide-react";
import LiveConversationStatus from "@/components/LiveConversationStatus.jsx";
import ChatTimestamp from "@/components/ChatTimestamp.jsx";
import { useLiveEnquiryMessages } from "@/hooks/useLiveEnquiryMessages.js";

export default function AdminEnquiryThread({ enquiry, initialMessages, canEdit }) {
  const streamUrl = `/api/admin/enquiries/${encodeURIComponent(enquiry.id)}/stream`;
  const { messages, addMessage, connection } = useLiveEnquiryMessages(streamUrl, initialMessages);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("idle");
  const [notice, setNotice] = useState(null);
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
    setNotice(null);
    const response = await fetch(`/api/admin/enquiries/${enquiry.id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body })
    });
    const payload = await response.json();
    if (!response.ok) {
      setNotice({ type: "error", message: payload.error || "Unable to send the reply." });
      setStatus("idle");
      return;
    }
    addMessage(payload.message);
    setBody("");
    setStatus("idle");
    setNotice({
      type: payload.deliveryStatus === "sent" ? "success" : "warning",
      message: payload.deliveryStatus === "sent"
        ? "Reply sent by email."
        : "Reply saved. Email delivery is queued until SMTP is available."
    });
  }

  return (
    <section>
      <div className="admin-page-header enquiry-thread-header">
        <Link className="btn-admin secondary" href="/admin/enquiries"><ArrowLeft size={16} /> Back</Link>
        <div className="conversation-title-row">
          <div>
            <p className="section-kicker">Enquiry Conversation</p>
            <h1>{enquiry.fullName}</h1>
          </div>
          <LiveConversationStatus status={connection} />
        </div>
        <p>{enquiry.serviceInterest || enquiry.eventType} · <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a></p>
      </div>
      {notice ? <div className={`notice ${notice.type}`}>{notice.message}</div> : null}
      <div className="enquiry-thread-layout">
        <div className="admin-form-card">
          <div className="admin-panel-body conversation-panel-body" ref={conversationScroll}>
            <div className="conversation-list" aria-live="polite">
              {messages.map((message) => (
                <article className={`conversation-message ${message.direction}`} key={message.id}>
                  <div>
                    <strong>{message.direction === "outbound" ? message.senderName || "Ephata Concepts" : enquiry.fullName}</strong>
                    <span><ChatTimestamp value={message.createdAt} /></span>
                  </div>
                  <p>{message.body}</p>
                  {message.direction === "outbound" ? (
                    <small className={`delivery-${message.deliveryStatus}`}>
                      {message.deliveryStatus === "sent" ? "Email sent" : message.deliveryStatus === "failed" ? "Email failed - saved in outbox" : "Email queued"}
                    </small>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </div>
        <aside className="admin-form-card">
          <div className="admin-panel-body">
            <Mail size={20} />
            <h2>Reply</h2>
            <p className="admin-panel-intro">Replies appear here immediately. Email delivery remains independent.</p>
            {canEdit ? (
              <form onSubmit={submit}>
                <div className="admin-field">
                  <label htmlFor="enquiry-reply">Message</label>
                  <textarea id="enquiry-reply" rows={8} value={body} onChange={(event) => setBody(event.target.value)} required />
                </div>
                <button className="btn-brand full-width" type="submit" disabled={status === "sending"}>
                  <Send size={16} /> {status === "sending" ? "Sending..." : "Send Reply"}
                </button>
              </form>
            ) : <div className="notice warning">You have view-only access to enquiries.</div>}
          </div>
        </aside>
      </div>
    </section>
  );
}
