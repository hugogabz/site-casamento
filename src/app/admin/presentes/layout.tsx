import { AdminShell } from "@/components/admin/admin-shell";

export default async function GiftsAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
