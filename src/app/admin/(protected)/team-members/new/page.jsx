import { redirect } from "next/navigation";

export default function LegacyNewTeamMemberPage() {
  redirect("/admin/team/members/new");
}
