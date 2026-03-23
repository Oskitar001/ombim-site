"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserLayout({ children }) {
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

      if (data.user.user_metadata?.role === "admin") {
        router.push("/panel/admin");
        return;
      }

      setMe(data.user);
      setLoading(false);
    }

    load();
  }, [router]);

  if (loading) return <div className="p-10">Cargando...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-black text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Mi panel</h2>

        <nav className="space-y-2">
          <Link href="/panel">Inicio</Link>
          <Link href="/panel/mis-licencias">Mis licencias</Link>
          <Link href="/panel/mis-plugins">Mis plugins</Link>
          <Link href="/panel/mis-descargas">Mis descargas</Link>
          <Link href="/panel/mis-pagos">Mis pagos</Link>
          <Link href="/panel/mis-facturas">Mis facturas</Link>
          <Link href="/panel/mis-datos">Datos de facturación</Link>
        </nav>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
