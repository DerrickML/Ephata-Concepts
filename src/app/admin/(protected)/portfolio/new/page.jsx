import AdminRecordForm from "@/components/admin/AdminRecordForm.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";
import { readCollection } from "@/lib/jsonStore.js";

export const metadata = {
  title: "New Portfolio Item"
};

export default async function NewPortfolioItemPage() {
  const config = getAdminCollectionConfig("portfolio");
  const categories = await readCollection("portfolioCategories");

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
