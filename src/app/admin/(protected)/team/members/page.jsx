import AdminCollectionIndex from "@/components/admin/AdminCollectionIndex.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";
import { readCollection } from "@/lib/jsonStore.js";
import { enrichTeamMembers } from "@/lib/team.js";

export const metadata = {
  title: "Admin Team Members"
};

export default async function AdminTeamMembersPage() {
  const config = getAdminCollectionConfig("teamMembers");
  const [members, categories] = await Promise.all([
    readCollection(config.collection),
    readCollection("teamCategories")
  ]);

  return (
    <AdminCollectionIndex
      collection={config.collection}
      apiPath={config.apiPath}
      title={config.title}
      description={config.description}
      columns={config.columns}
      items={enrichTeamMembers(members, categories)}
      createHref={`${config.path}/new`}
      editPathBase={config.path}
    />
  );
}
