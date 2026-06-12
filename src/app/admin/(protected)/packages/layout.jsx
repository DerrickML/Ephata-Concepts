import AdminSectionGuard from "@/components/admin/AdminSectionGuard.jsx";
import AdminContentCategoryNav from "@/components/admin/AdminContentCategoryNav.jsx";

export default function Layout({ children }) {
  return (
    <AdminSectionGuard section="packages">
      <AdminContentCategoryNav basePath="/admin/packages" recordsLabel="Packages" categoriesLabel="Categories" />
      {children}
    </AdminSectionGuard>
  );
}
