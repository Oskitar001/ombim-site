// app/panel/admin/layout.jsx
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      <aside className="w-64 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-6 space-y-6 shadow-xl">
        <h2 className="text-2xl font-bold">Panel Admin</h2>

        <nav className="flex flex-col space-y-3">
          <Link href="/panel/admin/dashboard" className="hover:text-white">
            📊 Dashboard
          </Link>

          <Link href="/panel/admin/licencias" className="hover:text-white">
            🎫 Licencias
          </Link>
          
          <Link href="/panel/admin/usuarios" className="hover:text-white">
           👤 Gestionar usuarios
          </Link>

          <Link href="/panel/admin/pagos" className="hover:text-white">
            💳 Pagos
          </Link>

          <Link href="/panel/admin/logs" className="hover:text-white">
            📜 Logs
          </Link>

          <Link href="/" className="hover:text-white">
            ⬅ Volver a la web
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}