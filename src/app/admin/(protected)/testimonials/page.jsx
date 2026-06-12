import AdminCollectionIndex from "@/components/admin/AdminCollectionIndex.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";
import { readCollection } from "@/lib/jsonStore.js";

export const metadata = {
  title: "Admin Testimonials"
};

export default async function AdminTestimonialsPage() {
  const config = getAdminCollectionConfig("testimonials");
  const items = await readCollection(config.collection);

  return (
    <AdminCollectionIndex
      collection={config.collection}
      title={config.title}
      description={config.description}
      columns={config.columns}
      items={items}
      createHref={`${config.path}/new`}
      editPathBase={config.path}
    />
  );
}
