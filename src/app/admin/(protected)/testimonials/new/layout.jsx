import AdminSectionGuard from "@/components/admin/AdminSectionGuard.jsx";
export default function Layout({ children }) { return <AdminSectionGuard section="testimonials" action="create">{children}</AdminSectionGuard>; }
