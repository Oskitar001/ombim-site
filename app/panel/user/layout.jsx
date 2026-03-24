import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function UserLayout({ children }) {
  const auth = await requireUser();
  if (!auth.ok) redirect(auth.redirect);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      <aside className="w-64 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-6 space-y-6 shadow-xl">
        <h2 className="text-2xl font-bold">Mi Panel</h2>

        <nav className="flex flex-col space-y-3">
          <Link href="/panel/user" className="hover:text-white">🏠 Inicio</Link>
          <Link href="/panel/mis-licencias" className="hover:text-white">🎫 Mis licencias</Link>
          <Link href="/panel/mis-plugins" className="hover:text-white">🔌 Mis plugins</Link>
          <Link href="/panel/mis-descargas" className="hover:text-white">⬇ Mis descargas</Link>
          <Link href="/panel/mis-pagos" className="hover:text-white">💳 Mis pagos</Link>
          <Link href="/panel/mis-facturas" className="hover:text-white">📄 Mis facturas</Link>
          <Link href="/panel/facturacion" className="hover:text-white">🏢 Facturación</Link>
        </nav>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}