"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();

      if (!data?.user) {
        router.push("/login");
        return;
      }

      if (data.user.user_metadata?.role !== "admin") {
        router.push("/panel");
        return;
      }

      setMe(data.user);
      setLoading(false);
    }

    load();
  }, [router]);

  // ⭐ IMPORTANTE: mantener el contenedor flex incluso mientras carga
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-lg font-semibold">Cargando admin...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-black text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Admin</h2>

        <nav className="space-y-2">
          <Link href="/panel/admin/dashboard">Dashboard</Link>
          <Link href="/panel/admin/licencias">Licencias</Link>
          <Link href="/panel/admin/licencias-tipos">Tipos de licencia</Link>
          <Link href="/panel/admin/plugins">Plugins</Link>
          <Link href="/panel/admin/usuarios">Usuarios</Link>
          <Link href="/panel/admin/pagos">Pagos</Link>
          <Link href="/panel/admin/logs">Logs</Link>
        </nav>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
