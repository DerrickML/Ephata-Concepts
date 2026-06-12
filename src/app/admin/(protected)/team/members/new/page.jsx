import AdminRecordForm from "@/components/admin/AdminRecordForm.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";
import { sortByOrder } from "@/lib/content.js";
import { readCollection } from "@/lib/jsonStore.js";

export const metadata = {
  title: "New Team Member"
};

export default async function NewTeamMemberPage() {
  const config = getAdminCollectionConfig("teamMembers");
  const categories = sortByOrder(await readCollection("teamCategories"));

  return (
    <AdminRecordForm
      collection={config.collection}
      apiPath={config.apiPath}
      title={config.singularTitle}
      description={config.description}
      fields={config.fields(categories)}
      indexPath={config.path}
    />
  );
}
