import AdminRecordForm from "@/components/admin/AdminRecordForm.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";

export const metadata = {
  title: "New Team Category"
};

export default function NewTeamCategoryPage() {
  const config = getAdminCollectionConfig("teamCategories");

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
