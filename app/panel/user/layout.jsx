"use client";

import Link from "next/link";

export default function UserLayout({ children }) {
  return (
    <div className="-mt-[88px] h-[calc(100vh-88px)] flex bg-gray-100 overflow-hidden">
      <aside className="w-64 bg-black text-white p-6 space-y-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Mi panel</h2>

        <nav className="space-y-2">
          <Link href="/panel/user" className="block">Inicio</Link>
          <Link href="/panel/user/mis-licencias" className="block">Mis licencias</Link>
          <Link href="/panel/user/mis-plugins" className="block">Mis plugins</Link>
          <Link href="/panel/user/mis-descargas" className="block">Mis descargas</Link>
          <Link href="/panel/user/mis-pagos" className="block">Mis pagos</Link>
          <Link href="/panel/user/mis-facturas" className="block">Mis facturas</Link>
          <Link href="/panel/user/mis-datos" className="block">Datos de facturación</Link>
        </nav>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
