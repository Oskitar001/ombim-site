// app/panel/admin/layout.jsx
import Link from "next/link";
import {
  LayoutDashboard,
  Ticket,
  CreditCard,
  Scroll,
  Users,
  Package,
  ArrowLeft,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <aside className="w-64 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-6 space-y-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Panel Admin</h2>

        <nav className="flex flex-col space-y-2">

          <Link href="/panel/admin/dashboard" className="flex items-center gap-3 hover:text-white">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link href="/panel/admin/licencias" className="flex items-center gap-3 hover:text-white">
            <Ticket size={20} />
            <span>Licencias</span>
          </Link>

          <Link href="/panel/admin/pagos" className="flex items-center gap-3 hover:text-white">
            <CreditCard size={20} />
            <span>Pagos</span>
          </Link>

          {/*  ⭐ AÑADIDO AHORA ⭐ */}
          <Link href="/panel/admin/plugins" className="flex items-center gap-3 hover:text-white">
            <Package size={20} />
            <span>Plugins</span>
          </Link>
          {/* ------------------- */}

          <Link href="/panel/admin/logs" className="flex items-center gap-3 hover:text-white">
            <Scroll size={20} />
            <span>Logs</span>
          </Link>

          <Link href="/panel/admin/usuarios" className="flex items-center gap-3 hover:text-white">
            <Users size={20} />
            <span>Usuarios</span>
          </Link>

          <Link href="/" className="flex items-center gap-3 hover:text-white mt-4">
            <ArrowLeft size={20} />
            <span>Volver</span>
          </Link>

        </nav>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}