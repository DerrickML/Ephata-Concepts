import { notFound } from "next/navigation";
import PublicEnquiryThread from "@/components/PublicEnquiryThread.jsx";
import { getEnquiryByConversationToken, getEnquiryMessages } from "@/lib/enquiryThreads.js";

export const metadata = { title: "Enquiry Conversation | Ephata Concepts" };

export default async function PublicEnquiryPage({ params }) {
  const { token } = await params;
  const enquiry = await getEnquiryByConversationToken(token);
  if (!enquiry) notFound();
  const messages = await getEnquiryMessages(enquiry.id);
  const initialMessages = messages.length ? messages : [{ id: `${enquiry.id}-initial`, direction: "inbound", body: enquiry.message, createdAt: enquiry.createdAt }];
  return <PublicEnquiryThread token={token} enquiry={{ fullName: enquiry.fullName, serviceInterest: enquiry.serviceInterest }} initialMessages={initialMessages} />;
}
