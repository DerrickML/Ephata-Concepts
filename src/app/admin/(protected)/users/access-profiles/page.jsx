import AdminAccessProfilesIndex from "@/components/admin/AdminAccessProfilesIndex.jsx";
import AdminUsersNav from "@/components/admin/AdminUsersNav.jsx";
import { readCollection } from "@/lib/jsonStore.js";

export const metadata = { title: "Admin Access Profiles" };
export default async function AccessProfilesPage() {
  const [profiles, users] = await Promise.all([readCollection("accessProfiles"), readCollection("users")]);
  const memberCounts = users.reduce((counts, user) => ({ ...counts, [user.accessProfileId]: (counts[user.accessProfileId] || 0) + 1 }), {});
  return <><AdminUsersNav /><AdminAccessProfilesIndex initialProfiles={profiles} memberCounts={memberCounts} /></>;
}
