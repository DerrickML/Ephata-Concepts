import AdminCategoryFormPage from "@/components/admin/AdminCategoryFormPage.jsx";

export const metadata = { title: "New Portfolio Type" };

export default function Page() {
  return <AdminCategoryFormPage collection="portfolioCategories" />;
}
