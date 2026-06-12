import { redirect } from "next/navigation";

export default async function LegacyEditTeamCategoryPage({ params }) {
  const { id } = await params;
  redirect(`/admin/team/categories/${encodeURIComponent(id)}/edit`);
}
