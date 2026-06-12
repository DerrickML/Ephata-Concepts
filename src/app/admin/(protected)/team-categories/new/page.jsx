import { redirect } from "next/navigation";

export default function LegacyNewTeamCategoryPage() {
  redirect("/admin/team/categories/new");
}
