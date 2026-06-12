import AdminCategoryFormPage from "@/components/admin/AdminCategoryFormPage.jsx";

export const metadata = { title: "New Package Category" };

export default function Page() {
  return <AdminCategoryFormPage collection="packageCategories" />;
}
