import { notFound } from "next/navigation";
import AdminEnquiryThread from "@/components/admin/AdminEnquiryThread.jsx";
import { getAdminFromCookies } from "@/lib/auth.js";
import { hasPermission } from "@/lib/accessControl.js";
import { getEnquiryMessages } from "@/lib/enquiryThreads.js";
import { readCollection } from "@/lib/jsonStore.js";

export const metadata = { title: "Enquiry Conversation" };

export default async function EnquiryConversationPage({ params }) {
  const { id } = await params;
  const [admin, enquiries, messages] = await Promise.all([getAdminFromCookies(), readCollection("enquiries"), getEnquiryMessages(id)]);
  const enquiry = enquiries.find((entry) => entry.id === id);
  if (!enquiry) notFound();
  const initialMessages = messages.length ? messages : [{ id: `${id}-initial`, direction: "inbound", body: enquiry.message, createdAt: enquiry.createdAt, deliveryStatus: "received" }];
  return <AdminEnquiryThread enquiry={enquiry} initialMessages={initialMessages} canEdit={hasPermission(admin, "enquiries", "edit")} />;
}
