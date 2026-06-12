import AdminCategoryIndexPage from "@/components/admin/AdminCategoryIndexPage.jsx";

export const metadata = { title: "Admin Portfolio Types" };

export default function Page() {
  return <AdminCategoryIndexPage collection="portfolioCategories" />;
}
