// app/panel/admin/layout.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  Ticket,
  CreditCard,
  Scroll,
  Users,
  Package,
  ArrowLeft,
  Menu,
  X
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* =============================
          MENÚ LATERAL — DESKTOP
      ============================= */}
      <aside className="hidden md:block w-64 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-6 space-y-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Panel Admin</h2>

        <nav className="flex flex-col space-y-2">
          <Link href="/panel/admin/dashboard" className="flex items-center gap-3 hover:text-white">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link href="/panel/admin/licencias" className="flex items-center gap-3 hover:text-white">
            <Ticket size={20} />
            <span>Licencias</span>
          </Link>

          <Link href="/panel/admin/pagos" className="flex items-center gap-3 hover:text-white">
            <CreditCard size={20} />
            <span>Pagos</span>
          </Link>

          <Link href="/panel/admin/plugins" className="flex items-center gap-3 hover:text-white">
            <Package size={20} />
            <span>Plugins</span>
          </Link>

          <Link href="/panel/admin/logs" className="flex items-center gap-3 hover:text-white">
            <Scroll size={20} />
            <span>Logs</span>
          </Link>

          <Link href="/panel/admin/usuarios" className="flex items-center gap-3 hover:text-white">
            <Users size={20} />
            <span>Usuarios</span>
          </Link>

          <Link href="/" className="flex items-center gap-3 hover:text-white mt-4">
            <ArrowLeft size={20} />
            <span>Volver</span>
          </Link>
        </nav>
      </aside>

      {/* =============================
          MENÚ HAMBURGUESA — MÓVIL
      ============================= */}
      <button
        className="md:hidden absolute top-4 left-4 z-30 bg-gray-300 dark:bg-gray-700 p-2 rounded"
        onClick={() => setOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Overlay oscuro */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 p-6 z-30 shadow-xl
          bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:hidden
        `}
      >
        {/* Cerrar */}
        <button
          className="absolute top-4 right-4"
          onClick={() => setOpen(false)}
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Panel Admin</h2>

        <nav className="flex flex-col space-y-3 text-lg">
          <Link href="/panel/admin/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 hover:text-white">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link href="/panel/admin/licencias" onClick={() => setOpen(false)} className="flex items-center gap-3 hover:text-white">
            <Ticket size={20} />
            <span>Licencias</span>
          </Link>

          <Link href="/panel/admin/pagos" onClick={() => setOpen(false)} className="flex items-center gap-3 hover:text-white">
            <CreditCard size={20} />
            <span>Pagos</span>
          </Link>

          <Link href="/panel/admin/plugins" onClick={() => setOpen(false)} className="flex items-center gap-3 hover:text-white">
            <Package size={20} />
            <span>Plugins</span>
          </Link>

          <Link href="/panel/admin/logs" onClick={() => setOpen(false)} className="flex items-center gap-3 hover:text-white">
            <Scroll size={20} />
            <span>Logs</span>
          </Link>

          <Link href="/panel/admin/usuarios" onClick={() => setOpen(false)} className="flex items-center gap-3 hover:text-white">
            <Users size={20} />
            <span>Usuarios</span>
          </Link>

          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 hover:text-white mt-4">
            <ArrowLeft size={20} />
            <span>Volver</span>
          </Link>
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-10 md:ml-0">{children}</main>
    </div>
  );
}