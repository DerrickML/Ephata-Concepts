import AdminSectionGuard from "@/components/admin/AdminSectionGuard.jsx";
import AdminContentCategoryNav from "@/components/admin/AdminContentCategoryNav.jsx";

export default function Layout({ children }) {
  return (
    <AdminSectionGuard section="portfolio">
      <AdminContentCategoryNav basePath="/admin/portfolio" recordsLabel="Portfolio" categoriesLabel="Types" />
      {children}
    </AdminSectionGuard>
  );
}
