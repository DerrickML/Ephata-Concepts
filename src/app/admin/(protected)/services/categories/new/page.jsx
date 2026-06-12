import AdminCategoryFormPage from "@/components/admin/AdminCategoryFormPage.jsx";

export const metadata = { title: "New Service Category" };

export default function Page() {
  return <AdminCategoryFormPage collection="serviceCategories" />;
}
