import Link from "next/link";
import { Home, KeyRound, CreditCard, Download } from "lucide-react";

export default function UserLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-light-bg dark:bg-dark-bg text-gray-900 dark:text-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-200 dark:bg-gray-800 p-6 shadow-xl flex flex-col gap-6">

        <div className="text-2xl font-bold tracking-tight">
          Panel Usuario
        </div>

        <nav className="flex flex-col gap-3">

          <Link href="/panel/user" className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
            <Home size={20} /> Inicio
          </Link>

          <Link href="/panel/user/licencias" className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
            <KeyRound size={20} /> Mis licencias
          </Link>

          <Link href="/panel/user/pagos" className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
            <CreditCard size={20} /> Mis pagos
          </Link>

          <Link href="/panel/user/descargas" className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
            <Download size={20} /> Descargas
          </Link>

          <Link href="/" className="mt-6 text-sm opacity-80 hover:opacity-100">
            ← Volver a ombim.site
          </Link>

        </nav>

      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-10">
        {children}
      </main>

    </div>
  );
}