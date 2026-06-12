import AdminCategoryFormPage from "@/components/admin/AdminCategoryFormPage.jsx";

export const metadata = { title: "New Insight Category" };

export default function Page() {
  return <AdminCategoryFormPage collection="insightCategories" />;
}
