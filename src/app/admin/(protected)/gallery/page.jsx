import AdminCollectionIndex from "@/components/admin/AdminCollectionIndex.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";
import { readCollection } from "@/lib/jsonStore.js";

export const metadata = {
  title: "Admin Gallery"
};

export default async function AdminGalleryPage() {
  const config = getAdminCollectionConfig("galleryAlbums");
  const items = await readCollection(config.collection);

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
