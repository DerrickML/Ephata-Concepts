import { notFound } from "next/navigation";
import AdminAccessProfileForm from "@/components/admin/AdminAccessProfileForm.jsx";
import AdminUsersNav from "@/components/admin/AdminUsersNav.jsx";
import { readCollection } from "@/lib/jsonStore.js";
export const metadata = { title: "Edit Access Profile" };
export default async function EditAccessProfilePage({ params }) { const { id } = await params; const profile = (await readCollection("accessProfiles")).find((entry) => entry.id === id); if (!profile || profile.isSystem) notFound(); return <><AdminUsersNav /><AdminAccessProfileForm profile={profile} /></>; }
