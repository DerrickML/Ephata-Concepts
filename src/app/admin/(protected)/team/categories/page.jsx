import AdminCollectionIndex from "@/components/admin/AdminCollectionIndex.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";
import { readCollection } from "@/lib/jsonStore.js";
import { sortByOrder } from "@/lib/content.js";

export const metadata = {
  title: "Admin Team Categories"
};

export default async function AdminTeamCategoriesPage() {
  const config = getAdminCollectionConfig("teamCategories");
  const items = sortByOrder(await readCollection(config.collection));

  return (
    <AdminCollectionIndex
      collection={config.collection}
      apiPath={config.apiPath}
      title={config.title}
      description={config.description}
      columns={config.columns}
      items={items}
      createHref={`${config.path}/new`}
      editPathBase={config.path}
    />
  );
}
