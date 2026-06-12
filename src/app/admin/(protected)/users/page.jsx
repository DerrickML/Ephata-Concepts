import AdminUsersIndex from "@/components/admin/AdminUsersIndex.jsx";
import AdminUsersNav from "@/components/admin/AdminUsersNav.jsx";
import { listPublicUsers } from "@/lib/userStore.js";

export const metadata = { title: "Admin Users" };

export default async function AdminUsersPage() {
  const users = await listPublicUsers();
  return <><AdminUsersNav /><AdminUsersIndex initialUsers={users} /></>;
}
