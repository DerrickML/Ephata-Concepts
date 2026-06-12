"use client";

import { createContext, useContext } from "react";

const AdminAccessContext = createContext(null);

export function AdminAccessProvider({ user, children }) {
  return <AdminAccessContext.Provider value={user}>{children}</AdminAccessContext.Provider>;
}

export function useAdminAccess() {
  const user = useContext(AdminAccessContext);
  if (!user) throw new Error("useAdminAccess must be used inside AdminAccessProvider");
  return user;
}

export function useCan(section, action = "view") {
  const user = useAdminAccess();
  return Boolean(user.permissions?.[section]?.includes(action));
}
