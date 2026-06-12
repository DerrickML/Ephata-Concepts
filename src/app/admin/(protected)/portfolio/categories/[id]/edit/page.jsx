import AdminCategoryFormPage from "@/components/admin/AdminCategoryFormPage.jsx";

export const metadata = { title: "Edit Portfolio Type" };

export default async function Page({ params }) {
  const { id } = await params;
  return <AdminCategoryFormPage collection="portfolioCategories" id={id} />;
}
