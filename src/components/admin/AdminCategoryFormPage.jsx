import { notFound } from "next/navigation";
import AdminRecordForm from "./AdminRecordForm.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";
import { readCollection } from "@/lib/jsonStore.js";

export default async function AdminCategoryFormPage({ collection, id = null }) {
  const config = getAdminCollectionConfig(collection);
  const item = id
    ? (await readCollection(config.collection)).find((entry) => entry.id === id)
    : null;
  if (id && !item) notFound();

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
