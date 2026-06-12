import AdminCategoryIndexPage from "@/components/admin/AdminCategoryIndexPage.jsx";

export const metadata = { title: "Admin Package Categories" };

export default function Page() {
  return <AdminCategoryIndexPage collection="packageCategories" />;
}
