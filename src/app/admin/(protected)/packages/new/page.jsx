import AdminRecordForm from "@/components/admin/AdminRecordForm.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";
import { readCollection } from "@/lib/jsonStore.js";

export const metadata = {
  title: "New Package"
};

export default async function NewPackagePage() {
  const config = getAdminCollectionConfig("packages");
  const categories = await readCollection("packageCategories");

  return (
    <AdminRecordForm
      collection={config.collection}
      title={config.singularTitle}
      description={config.description}
      fields={config.fields(categories)}
      indexPath={config.path}
    />
  );
}
