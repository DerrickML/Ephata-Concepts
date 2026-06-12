import AdminLayout from "@/components/admin/AdminLayout.jsx";
import { requireAdminPage } from "@/lib/auth.js";
import { redirect } from "next/navigation";

export default async function ProtectedAdminLayout({ children }) {
  const admin = await requireAdminPage();
  if (admin.mustChangePassword) redirect("/admin/change-password");
  return <AdminLayout currentUser={admin}>{children}</AdminLayout>;
}
