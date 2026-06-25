import AdminCollectionIndex from "@/components/admin/AdminCollectionIndex.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";
import { readCollection } from "@/lib/jsonStore.js";

export const metadata = {
  title: "Admin Gallery"
};

export default async function AdminGalleryPage() {
  const config = getAdminCollectionConfig("galleryAlbums");
  const items = await readCollection(config.collection);
  const rows = items.map((item) => ({
    ...item,
    imageCount: Array.isArray(item.images) ? item.images.length : 0,
    videoCount: Array.isArray(item.videoLinks) ? item.videoLinks.length : 0
  }));

  return (
    <AdminCollectionIndex
      collection={config.collection}
      apiPath={config.apiPath}
      title={config.title}
      description={config.description}
      columns={config.columns}
      items={rows}
      createHref={`${config.path}/new`}
      editPathBase={config.path}
    />
  );
}
