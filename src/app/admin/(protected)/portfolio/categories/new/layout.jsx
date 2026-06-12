import AdminSectionGuard from "@/components/admin/AdminSectionGuard.jsx";
export default function Layout({ children }) { return <AdminSectionGuard section="portfolio" action="create">{children}</AdminSectionGuard>; }
