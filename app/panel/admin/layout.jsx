// app/panel/admin/layout.jsx
import { requireAdmin } from "@/lib/checkAdmin";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    redirect(auth.redirect ?? "/login");
  }

  return (
    <div className="admin-layout flex">
      <aside className="w-64 p-4 border-r">
        <h3 className="font-bold mb-4">Admin</h3>

        <nav className="flex flex-col gap-2">
              <Link href="/panel/admin/logs">Logs</Link>
        </nav>
      </aside>

      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
