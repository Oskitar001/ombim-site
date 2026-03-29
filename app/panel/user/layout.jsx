import Link from "next/link";
import {
  Home,
  KeyRound,
  CreditCard,
  Download,
  User,
} from "lucide-react";

export default function UserLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">

      {/* SIDEBAR FIJO */}
      <aside
        className="
          w-64 
          bg-gray-100 dark:bg-gray-900 
          p-4 space-y-4 
          border-r border-gray-300 dark:border-gray-700
          flex-shrink-0
          overflow-hidden
          fixed
          inset-y-0
        "
      >
        <h2 className="text-xl font-bold mb-4">Panel Usuario</h2>

        <nav className="space-y-2">

          <Link
            href="/panel/user"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Home size={18} />
            Inicio
          </Link>

          <Link
            href="/panel/user/licencias"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <KeyRound size={18} />
            Mis licencias
          </Link>

          <Link
            href="/panel/user/pagos"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <CreditCard size={18} />
            Mis pagos
          </Link>

          <Link
            href="/panel/user/mis-datos"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <User size={18} />
            Mis datos
          </Link>

          <Link
            href="/panel/user/descargas"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Download size={18} />
            Descargas
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 mt-4"
          >
            ← Volver a ombim.site
          </Link>

        </nav>
      </aside>

      {/* CONTENIDO DESPLAZABLE */}
      <main
        className="
          flex-1 
          ml-64 
          p-6 
          overflow-y-auto 
          bg-gray-50 dark:bg-gray-800
        "
      >
        {children}
      </main>
    </div>
  );
}