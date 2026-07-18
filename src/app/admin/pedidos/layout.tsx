import { AdminShell } from "@/components/admin/admin-shell";

export default function OrdersAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
