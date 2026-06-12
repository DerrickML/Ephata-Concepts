import AdminCollectionIndex from "@/components/admin/AdminCollectionIndex.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";
import { readCollection } from "@/lib/jsonStore.js";
import { enrichCategorizedItems } from "@/lib/contentCategories.js";

export const metadata = {
  title: "Admin Services"
};

export default async function AdminServicesPage() {
  const config = getAdminCollectionConfig("services");
  const [items, categories] = await Promise.all([
    readCollection(config.collection),
    readCollection("serviceCategories")
  ]);

  return (
    <AdminCollectionIndex
      collection={config.collection}
      title={config.title}
      description={config.description}
      columns={config.columns}
      items={enrichCategorizedItems(items, categories)}
      createHref={`${config.path}/new`}
      editPathBase={config.path}
    />
  );
}
