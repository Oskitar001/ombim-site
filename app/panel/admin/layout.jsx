"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      const me = await fetch("/api/auth/me").then(r => r.json());

      if (!me || me.error || me.role !== "admin") {
        router.push("/panel");
        return;
      }

      setLoading(false);
    }

    cargar();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando panel admin...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      <aside className="w-64 bg-black text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Admin</h2>

        <nav className="space-y-2">
          <Link href="/panel/admin/dashboard" className="block hover:text-blue-400">Dashboard</Link>
          <Link href="/panel/admin/licencias" className="block hover:text-blue-400">Licencias</Link>
          <Link href="/panel/admin/licencias-tipos" className="block hover:text-blue-400">Tipos de licencia</Link>
          <Link href="/panel/admin/plugins" className="block hover:text-blue-400">Plugins</Link>
          <Link href="/panel/admin/users" className="block hover:text-blue-400">Usuarios</Link>
          <Link href="/panel/admin/pagos" className="block hover:text-blue-400">Pagos</Link>
          <Link href="/panel/admin/logs" className="block hover:text-blue-400">Logs</Link>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
