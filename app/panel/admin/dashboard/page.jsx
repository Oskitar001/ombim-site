// /app/panel/admin/dashboard/page.jsx
import { requireAdmin } from "@/lib/checkAdmin";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const auth = await requireAdmin();
  if (!auth.ok) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/dashboard`, {
    cache: "no-store",
  });

  const stats = await res.json();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded">
          <h3>Total licencias</h3>
          <p>{stats.totalLicencias}</p>
        </div>

        <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded">
          <h3>Pagos</h3>
          <p>{stats.totalPagos}</p>
        </div>
      </div>
    </div>
  );
}