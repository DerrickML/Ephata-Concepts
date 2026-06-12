import AdminRecordForm from "@/components/admin/AdminRecordForm.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";
import { readCollection } from "@/lib/jsonStore.js";

export const metadata = {
  title: "New Insight"
};

export default async function NewInsightPage() {
  const config = getAdminCollectionConfig("insights");
  const categories = await readCollection("insightCategories");

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
