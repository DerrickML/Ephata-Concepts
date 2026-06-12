import AdminCollectionIndex from "./AdminCollectionIndex.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";
import { sortByOrder } from "@/lib/content.js";
import { readCollection } from "@/lib/jsonStore.js";

export default async function AdminCategoryIndexPage({ collection }) {
  const config = getAdminCollectionConfig(collection);
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
