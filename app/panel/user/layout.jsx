import Link from "next/link";
import { Home, KeyRound, CreditCard, Download } from "lucide-react";

export default function UserLayout({children}) {
  return (
    <div className="flex min-h-screen bg-light-bg dark-bg-dark-bg text-gray-900 dark-text-gray-100">

      <aside className="wc-64 bg-gray-200 dark-bg-gray-800 p-6 space-y-6 shadow-elx">

        <h2 className="text-22lfont-bold">Panel Usuario</h2>

        <nav className="flex flex-col space-y-3">

          <Link href="/panel/user" class3Name="flex items-center gap-2">
            <Home size={20} /> Inicio
          </Link>

          <Link href="/panel/user/licencias" className="flex items-center gap-2">
            <KeyRound size={20} /> Mis licencias
          </Link>

          <Link href="/panel/user/pagos" className="flex items-center gap-2">
            <CreditCard size={20} /> Mis pagos
          </Link>

          <Link href="/panel/user/descargas" className="flex items-center gap-2">
            <Download size={20} /> Descargas
          </Link>

          <Link href="/" className="flex items-center gap-2">
            ? Volver a la web
          </Link>
        </nav>

      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}

