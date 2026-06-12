import { notFound } from "next/navigation";
import AdminRecordForm from "@/components/admin/AdminRecordForm.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";
import { readCollection } from "@/lib/jsonStore.js";

export const metadata = {
  title: "Edit Package"
};

export default async function EditPackagePage({ params }) {
  const { id } = await params;
  const config = getAdminCollectionConfig("packages");
  const [items, categories] = await Promise.all([
    readCollection(config.collection),
    readCollection("packageCategories")
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
