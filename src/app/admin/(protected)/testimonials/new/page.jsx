import AdminRecordForm from "@/components/admin/AdminRecordForm.jsx";
import { getAdminCollectionConfig } from "@/forms/adminCollectionConfig.js";

export const metadata = {
  title: "New Testimonial"
};

export default function NewTestimonialPage() {
  const config = getAdminCollectionConfig("testimonials");

  return (
    <AdminRecordForm
      collection={config.collection}
      title={config.singularTitle}
      description={config.description}
      fields={config.fields}
      indexPath={config.path}
    />
  );
}
