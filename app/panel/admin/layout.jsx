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
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-800">

      {/* ---------- SIDEBAR ESCRITORIO PRIMERO EN EL DOM ---------- */}
      <aside
        className="
          hidden md:flex
          flex-col
          w-64
          bg-gray-100 dark:bg-gray-900
          p-4 space-y-4
          border-r border-gray-300 dark:border-gray-700
          z-20
        "
      >
        <h2 className="text-xl font-bold mb-4">Panel Admin</h2>

        <nav className="space-y-2 text-base">
          <Link href="/panel/admin/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link href="/panel/admin/licencias" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
            <Ticket size={18} /> Licencias
          </Link>

          <Link href="/panel/admin/pagos" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
            <CreditCard size={18} /> Pagos
          </Link>

          <Link href="/panel/admin/plugins" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
            <Package size={18} /> Plugins
          </Link>

          <Link href="/panel/admin/logs" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
            <Scroll size={18} /> Logs
          </Link>

          <Link href="/panel/admin/usuarios" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
            <Users size={18} /> Usuarios
          </Link>

          <Link href="/" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 mt-4">
            <ArrowLeft size={18} /> Volver
          </Link>
        </nav>
      </aside>

      {/* ---------- BOTON HAMBURGUESA (MÓVIL) ---------- */}
      <button
        className="md:hidden absolute top-4 left-4 z-30 bg-gray-300 dark:bg-gray-700 p-2 rounded"
        onClick={() => setOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* ---------- OVERLAY (MÓVIL) ---------- */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* ---------- SIDEBAR MÓVIL ---------- */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 p-4 z-30 shadow-xl
          bg-gray-100 dark:bg-gray-900
          border-r border-gray-300 dark:border-gray-700
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:hidden
        `}
      >
        <button className="absolute top-4 right-4" onClick={() => setOpen(false)}>
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6">Panel Admin</h2>

        <nav className="space-y-3 text-lg">
          <Link href="/panel/admin/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link href="/panel/admin/licencias" onClick={() => setOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
            <Ticket size={18} /> Licencias
          </Link>

          <Link href="/panel/admin/pagos" onClick={() => setOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
            <CreditCard size={18} /> Pagos
          </Link>

          <Link href="/panel/admin/plugins" onClick={() => setOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
            <Package size={18} /> Plugins
          </Link>

          <Link href="/panel/admin/logs" onClick={() => setOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
            <Scroll size={18} /> Logs
          </Link>

          <Link href="/panel/admin/usuarios" onClick={() => setOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
            <Users size={18} /> Usuarios
          </Link>

          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 mt-4">
            <ArrowLeft size={18} /> Volver
          </Link>
        </nav>
      </aside>

      {/* ---------- CONTENIDO PRINCIPAL ---------- */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}