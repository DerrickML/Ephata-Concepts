import AdminRecordForm from "@/components/admin/AdminRecordForm.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";
import { readCollection } from "@/lib/jsonStore.js";

export const metadata = {
  title: "New Service"
};

export default async function NewServicePage() {
  const config = getAdminCollectionConfig("services");
  const categories = await readCollection("serviceCategories");

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
