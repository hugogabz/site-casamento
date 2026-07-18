import { AdminHeader } from "@/components/admin/admin-header";
import { requireAdmin } from "@/lib/admin-auth";

export async function AdminShell({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[#f8f2ea] text-[#44362f]">
      <AdminHeader />
      {children}
    </div>
  );
}
