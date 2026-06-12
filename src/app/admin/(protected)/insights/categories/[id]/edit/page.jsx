import AdminCategoryFormPage from "@/components/admin/AdminCategoryFormPage.jsx";

export const metadata = { title: "Edit Insight Category" };

export default async function Page({ params }) {
  const { id } = await params;
  return <AdminCategoryFormPage collection="insightCategories" id={id} />;
}
