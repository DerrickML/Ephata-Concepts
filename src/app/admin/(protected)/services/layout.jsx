import AdminSectionGuard from "@/components/admin/AdminSectionGuard.jsx";
import AdminContentCategoryNav from "@/components/admin/AdminContentCategoryNav.jsx";

export default function Layout({ children }) {
  return (
    <AdminSectionGuard section="services">
      <AdminContentCategoryNav basePath="/admin/services" recordsLabel="Services" categoriesLabel="Categories" />
      {children}
    </AdminSectionGuard>
  );
}
