import AdminRecordForm from "@/components/admin/AdminRecordForm.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";

export const metadata = {
  title: "New Gallery Album"
};

export default function NewGalleryAlbumPage() {
  const config = getAdminCollectionConfig("galleryAlbums");

  return (
    <AdminRecordForm
      collection={config.collection}
      apiPath={config.apiPath}
      title={config.singularTitle}
      description={config.description}
      fields={config.fields}
      indexPath={config.path}
    />
  );
}
