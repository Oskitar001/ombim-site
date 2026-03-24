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
        router.push("/panel/user");
        return;
      }

      setMe(data.user);
      setLoading(false);
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <div className="-mt-[88px] h-[calc(100vh-88px)] flex items-center justify-center bg-gray-100">
        <div className="text-lg font-semibold">Cargando admin...</div>
      </div>
    );
  }

  return (
    <div className="-mt-[88px] h-[calc(100vh-88px)] flex bg-gray-100 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-black text-white p-6 space-y-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Admin</h2>

        <nav className="space-y-2">
          <Link href="/panel/admin/dashboard" className="block">Dashboard</Link>
          <Link href="/panel/admin/licencias" className="block">Licencias</Link>
          <Link href="/panel/admin/licencias-tipos" className="block">Tipos de licencia</Link>
          <Link href="/panel/admin/plugins" className="block">Plugins</Link>
          <Link href="/panel/admin/usuarios" className="block">Usuarios</Link>
          <Link href="/panel/admin/pagos" className="block">Pagos</Link>
          <Link href="/panel/admin/logs" className="block">Logs</Link>
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
