import { requirePermissionPage } from "@/lib/auth.js";

export default async function AdminSectionGuard({ section, action = "view", children }) {
  await requirePermissionPage(section, action);
  return children;
}
