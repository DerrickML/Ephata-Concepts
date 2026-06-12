import { redirect } from "next/navigation";

export default function LegacyTeamMembersPage() {
  redirect("/admin/team/members");
}
