import { notFound } from "next/navigation";
import AdminRecordForm from "@/components/admin/AdminRecordForm.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";
import { readCollection } from "@/lib/jsonStore.js";

export const metadata = {
  title: "Edit Portfolio Item"
};

export default async function EditPortfolioItemPage({ params }) {
  const { id } = await params;
  const config = getAdminCollectionConfig("portfolio");
  const [items, categories] = await Promise.all([
    readCollection(config.collection),
    readCollection("portfolioCategories")
  ]);
  const item = items.find((entry) => entry.id === id);
  if (!item) notFound();

  return (
    <AdminRecordForm
      collection={config.collection}
      title={config.singularTitle}
      description={config.description}
      fields={config.fields(categories)}
      item={item}
      indexPath={config.path}
    />
  );
}
