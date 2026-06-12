import { notFound } from "next/navigation";
import AdminUserForm from "@/components/admin/AdminUserForm.jsx";
import AdminUsersNav from "@/components/admin/AdminUsersNav.jsx";
import { requireAdminPage } from "@/lib/auth.js";
import { readCollection } from "@/lib/jsonStore.js";
import { getResolvedUser } from "@/lib/userStore.js";
import { canManageUsers } from "@/lib/accessControl.js";
import { getEmailSettingsView } from "@/lib/emailService.js";

export const metadata = { title: "Edit Admin User" };
export default async function EditUserPage({ params }) {
  const { id } = await params;
  const [user, profiles, current, emailSettings] = await Promise.all([getResolvedUser(id), readCollection("accessProfiles"), requireAdminPage(), getEmailSettingsView()]);
  if (!user) notFound();
  return <><AdminUsersNav /><AdminUserForm user={user} profiles={profiles} lockAccess={!canManageUsers(current) || user.isSystemOwner || user.id === current.id} emailAvailable={emailSettings.accountInvitationsAvailable} /></>;
}
