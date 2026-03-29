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

      {/* ============================
          BOTÓN HAMBURGUESA (MÓVIL)
      ============================ */}
      <button
        className="md:hidden absolute top-4 left-4 z-[999] bg-gray-300 dark:bg-gray-700 
                   p-2 rounded shadow-lg hover:bg-gray-400 dark:hover:bg-gray-600"
        onClick={() => setOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* ============================
          OVERLAY OSCURO
      ============================ */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998] md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* ============================
          SIDEBAR MÓVIL (DRAWER)
      ============================ */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 p-4 z-[999] shadow-xl
          bg-gray-100 dark:bg-gray-900
          border-r border-gray-300 dark:border-gray-700
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:hidden
        `}
      >
        {/* Botón cerrar */}
        <button
          className="absolute top-4 right-4 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          onClick={() => setOpen(false)}
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6 mt-2">Panel Admin</h2>

        <AdminMenu onNavigate={() => setOpen(false)} />
      </aside>

      {/* ============================
          SIDEBAR DESKTOP
      ============================ */}
      <aside
        className="
          hidden md:block
          w-64 h-full
          bg-gray-100 dark:bg-gray-900
          p-4 space-y-4
          border-r border-gray-300 dark:border-gray-700
        "
      >
        <h2 className="text-xl font-bold mb-4">Panel Admin</h2>
        <AdminMenu />
      </aside>

      {/* ============================
          CONTENIDO PRINCIPAL
      ============================ */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}

/* ==============================
   COMPONENTE MENÚ REUTILIZABLE
=============================== */

function AdminMenu({ onNavigate = () => {} }) {
  const linkClasses =
    "flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition";

  return (
    <nav className="space-y-2 text-base">

      <Link href="/panel/admin" className={linkClasses} onClick={onNavigate}>
        <LayoutDashboard size={18} /> Dashboard
      </Link>

      <Link href="/panel/admin/licencias" className={linkClasses} onClick={onNavigate}>
        <Ticket size={18} /> Licencias
      </Link>

      <Link href="/panel/admin/pagos" className={linkClasses} onClick={onNavigate}>
        <CreditCard size={18} /> Pagos
      </Link>

      <Link href="/panel/admin/plugins" className={linkClasses} onClick={onNavigate}>
        <Package size={18} /> Plugins
      </Link>

      <Link href="/panel/admin/logs" className={linkClasses} onClick={onNavigate}>
        <Scroll size={18} /> Logs
      </Link>

      <Link href="/panel/admin/usuarios" className={linkClasses} onClick={onNavigate}>
        <Users size={18} /> Usuarios
      </Link>

      <Link href="/" className={`${linkClasses} mt-4`} onClick={onNavigate}>
        <ArrowLeft size={18} /> Volver a ombim.site
      </Link>

    </nav>
  );
}
