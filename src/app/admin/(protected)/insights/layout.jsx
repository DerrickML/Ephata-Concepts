import AdminSectionGuard from "@/components/admin/AdminSectionGuard.jsx";
import AdminContentCategoryNav from "@/components/admin/AdminContentCategoryNav.jsx";

export default function Layout({ children }) {
  return (
    <AdminSectionGuard section="insights">
      <AdminContentCategoryNav basePath="/admin/insights" recordsLabel="Insights" categoriesLabel="Categories" />
      {children}
    </AdminSectionGuard>
  );
}
