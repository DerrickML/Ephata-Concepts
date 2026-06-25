import { notFound } from "next/navigation";
import AdminRecordForm from "@/components/admin/AdminRecordForm.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";
import { readCollection } from "@/lib/jsonStore.js";

export const metadata = {
  title: "Edit Gallery Album"
};

export default async function EditGalleryAlbumPage({ params }) {
  const { id } = await params;
  const config = getAdminCollectionConfig("galleryAlbums");
  const items = await readCollection(config.collection);
  const item = items.find((entry) => entry.id === id);
  if (!item) notFound();

  return (
    <AdminRecordForm
      collection={config.collection}
      apiPath={config.apiPath}
      title={config.singularTitle}
      description={config.description}
      fields={config.fields}
      item={item}
      indexPath={config.path}
    />
  );
}
