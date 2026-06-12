import AdminChangePasswordForm from "@/components/admin/AdminChangePasswordForm.jsx";
import { requireAdminPage } from "@/lib/auth.js";

export const metadata = { title: "Change Admin Password" };

export default async function ChangePasswordPage() {
  await requireAdminPage();
  return <AdminChangePasswordForm />;
}
