import AdminUserForm from "@/components/admin/AdminUserForm.jsx";
import AdminUsersNav from "@/components/admin/AdminUsersNav.jsx";
import { readCollection } from "@/lib/jsonStore.js";
import { requireAdminPage } from "@/lib/auth.js";
import { canManageUsers } from "@/lib/accessControl.js";
import { getEmailSettingsView } from "@/lib/emailService.js";

export const metadata = { title: "Create Admin User" };
export default async function NewUserPage() {
  const [profiles, current, emailSettings] = await Promise.all([readCollection("accessProfiles"), requireAdminPage(), getEmailSettingsView()]);
  return <><AdminUsersNav /><AdminUserForm profiles={profiles} lockAccess={!canManageUsers(current)} emailAvailable={emailSettings.accountInvitationsAvailable} /></>;
}
