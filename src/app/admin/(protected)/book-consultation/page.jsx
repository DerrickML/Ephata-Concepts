import { redirect } from "next/navigation";

export const metadata = {
  title: "Consultation Settings"
};

export default function AdminConsultationRedirectPage() {
  redirect("/admin/settings?panel=consultation");
}
