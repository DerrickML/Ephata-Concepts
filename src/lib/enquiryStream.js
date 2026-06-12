import { getEnquiryMessages } from "./enquiryThreads.js";

const encoder = new TextEncoder();
const POLL_INTERVAL_MS = 1000;
const HEARTBEAT_INTERVAL_MS = 15000;

function eventPayload(event, data) {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function messageVersion(messages) {
  return messages.map((message) => `${message.id}:${message.updatedAt}:${message.deliveryStatus}`).join("|");
}

export function conversationMessages(enquiry, messages) {
  if (messages.length || !enquiry?.message) return messages;
  return [{
    id: `${enquiry.id}-initial`,
    enquiryId: enquiry.id,
    direction: "inbound",
    senderName: enquiry.fullName,
    senderEmail: enquiry.email,
    recipientEmail: "",
    body: enquiry.message,
    actorId: null,
    deliveryStatus: "received",
    emailOutboxId: null,
    createdAt: enquiry.createdAt,
    updatedAt: enquiry.updatedAt || enquiry.createdAt
  }];
}

export function createEnquiryMessageStream(enquiry, signal) {
  let timer = null;
  let heartbeatTimer = null;
  let closed = false;
  let lastVersion = "";

  return new ReadableStream({
    async start(controller) {
      function close() {
        if (closed) return;
        closed = true;
        if (timer) clearInterval(timer);
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        try { controller.close(); } catch {}
      }

      async function publish() {
        if (closed) return;
        try {
          const messages = conversationMessages(enquiry, await getEnquiryMessages(enquiry.id));
          if (closed) return;
          const version = messageVersion(messages);
          if (version !== lastVersion) {
            lastVersion = version;
            controller.enqueue(eventPayload("messages", { messages }));
          }
        } catch {
          controller.enqueue(eventPayload("stream-error", { message: "Unable to refresh this conversation." }));
        }
      }

      if (signal.aborted) {
        close();
        return;
      }
      signal.addEventListener("abort", close, { once: true });
      controller.enqueue(eventPayload("connected", { enquiryId: enquiry.id }));
      await publish();
      timer = setInterval(publish, POLL_INTERVAL_MS);
      heartbeatTimer = setInterval(() => {
        if (!closed) controller.enqueue(eventPayload("heartbeat", { at: new Date().toISOString() }));
      }, HEARTBEAT_INTERVAL_MS);
    },
    cancel() {
      closed = true;
      if (timer) clearInterval(timer);
      if (heartbeatTimer) clearInterval(heartbeatTimer);
    }
  });
}

export function enquiryStreamResponse(enquiry, signal) {
  return new Response(createEnquiryMessageStream(enquiry, signal), {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no"
    }
  });
}
