"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Home,
  KeyRound,
  CreditCard,
  Download,
  User,
  Menu,
  X,
  ArrowLeft
} from "lucide-react";

export default function UserLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-800">

      {/* =============================
          BOTÓN HAMBURGUESA (MÓVIL)
      ============================= */}
      <button
        className="md:hidden absolute top-4 left-4 z-[999] bg-gray-300 dark:bg-gray-700 p-2 rounded shadow-lg"
        onClick={() => setOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* =============================
          OVERLAY OSCURO (MÓVIL)
      ============================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998] md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* =============================
          SIDEBAR MÓVIL (DRAWER)
      ============================= */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 p-4 z-[999]
          shadow-xl bg-gray-100 dark:bg-gray-900
          border-r border-gray-300 dark:border-gray-700
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:hidden
        `}
      >
        {/* Cerrar menú */}
        <button
          className="absolute top-4 right-4 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setOpen(false)}
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6 mt-1">Panel Usuario</h2>

        <nav className="space-y-3 text-lg">

          <Link
            href="/panel/user"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Home size={18} />
            Inicio
          </Link>

          <Link
            href="/panel/user/licencias"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <KeyRound size={18} />
            Mis licencias
          </Link>

          <Link
            href="/panel/user/pagos"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <CreditCard size={18} />
            Mis pagos
          </Link>

          <Link
            href="/panel/user/mis-datos"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <User size={18} />
            Mis datos
          </Link>

          <Link
            href="/panel/user/descargas"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Download size={18} />
            Descargas
          </Link>

          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 mt-4"
          >
            <ArrowLeft size={18} />
            Volver a ombim.site
          </Link>

        </nav>
      </aside>

      {/* =============================
          SIDEBAR DESKTOP
      ============================= */}
      <aside
        className="
          hidden md:block
          w-64 
          bg-gray-100 dark:bg-gray-900 
          p-4 space-y-4 
          border-r border-gray-300 dark:border-gray-700
        "
      >
        <h2 className="text-xl font-bold mb-4">Panel Usuario</h2>

        <nav className="space-y-2 text-base">

          <Link
            href="/panel/user"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Home size={18} />
            Inicio
          </Link>

          <Link
            href="/panel/user/licencias"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <KeyRound size={18} />
            Mis licencias
          </Link>

          <Link
            href="/panel/user/pagos"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <CreditCard size={18} />
            Mis pagos
          </Link>

          <Link
            href="/panel/user/mis-datos"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <User size={18} />
            Mis datos
          </Link>

          <Link
            href="/panel/user/descargas"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Download size={18} />
            Descargas
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 mt-4"
          >
            <ArrowLeft size={18} />
            Volver a ombim.site
          </Link>

        </nav>
      </aside>

      {/* =============================
          CONTENIDO PRINCIPAL
      ============================= */}
     
       <main className="
  flex-1 
  p-6 
  pt-20 md:pt-6
  overflow-y-auto 
  bg-gray-50 dark:bg-gray-800
">
        {children}
      </main>

    </div>
  );
}