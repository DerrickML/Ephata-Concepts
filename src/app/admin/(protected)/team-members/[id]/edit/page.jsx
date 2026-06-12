import { redirect } from "next/navigation";

export default async function LegacyEditTeamMemberPage({ params }) {
  const { id } = await params;
  redirect(`/admin/team/members/${encodeURIComponent(id)}/edit`);
}
