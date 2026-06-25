import AdminSectionGuard from "@/components/admin/AdminSectionGuard.jsx";

export default function Layout({ children }) {
  return <AdminSectionGuard section="gallery" action="create">{children}</AdminSectionGuard>;
}
