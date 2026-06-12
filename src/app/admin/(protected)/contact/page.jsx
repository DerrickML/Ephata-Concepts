import { redirect } from "next/navigation";

export const metadata = {
  title: "Contact Settings"
};

export default function AdminContactRedirectPage() {
  redirect("/admin/settings?panel=contact");
}
