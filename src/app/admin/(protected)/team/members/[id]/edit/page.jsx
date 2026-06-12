import { notFound } from "next/navigation";
import AdminRecordForm from "@/components/admin/AdminRecordForm.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";
import { sortByOrder } from "@/lib/content.js";
import { readCollection } from "@/lib/jsonStore.js";

export const metadata = {
  title: "Edit Team Member"
};

export default async function EditTeamMemberPage({ params }) {
  const { id } = await params;
  const config = getAdminCollectionConfig("teamMembers");
  const [items, categories] = await Promise.all([
    readCollection(config.collection),
    readCollection("teamCategories")
  ]);
  const item = items.find((entry) => entry.id === id);
  if (!item) notFound();

  return (
    <AdminRecordForm
      collection={config.collection}
      apiPath={config.apiPath}
      title={config.singularTitle}
      description={config.description}
      fields={config.fields(sortByOrder(categories))}
      item={item}
      indexPath={config.path}
    />
  );
}
