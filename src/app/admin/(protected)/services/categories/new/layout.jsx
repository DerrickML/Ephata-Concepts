import AdminSectionGuard from "@/components/admin/AdminSectionGuard.jsx";
export default function Layout({ children }) { return <AdminSectionGuard section="services" action="create">{children}</AdminSectionGuard>; }
