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
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-800 pt-[72px]">

      {/* ====================================
          BOTÓN HAMBURGUESA (MÓVIL)
      ==================================== */}
      <button
        className="
          md:hidden 
          fixed top-[80px] left-4 z-[60]
          bg-white dark:bg-gray-700 
          p-2 rounded-lg shadow-lg 
          border border-gray-300 dark:border-gray-600
        "
        onClick={() => setOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* ====================================
          OVERLAY OSCURO (MÓVIL)
      ==================================== */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50] md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ====================================
          SIDEBAR MÓVIL (DRAWER)
      ==================================== */}
      <aside
        className={`
          fixed top-[72px] left-0 
          h-[calc(100vh-72px)] w-64 
          p-4 z-[60]
          bg-white dark:bg-gray-900
          border-r border-gray-300 dark:border-gray-700
          shadow-xl
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:hidden
        `}
      >
        {/* Botón cerrar */}
        <button
          className="absolute top-4 right-4 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setOpen(false)}
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 mt-2 text-gray-900 dark:text-gray-100">
          Panel Usuario
        </h2>

        <nav className="space-y-3 text-lg">
          <PanelLink href="/panel/user" icon={<Home size={18} />} onClick={() => setOpen(false)}>
            Inicio
          </PanelLink>

          <PanelLink href="/panel/user/licencias" icon={<KeyRound size={18} />} onClick={() => setOpen(false)}>
            Mis licencias
          </PanelLink>

          <PanelLink href="/panel/user/pagos" icon={<CreditCard size={18} />} onClick={() => setOpen(false)}>
            Mis pagos
          </PanelLink>

          <PanelLink href="/panel/user/mis-datos" icon={<User size={18} />} onClick={() => setOpen(false)}>
            Mis datos
          </PanelLink>

          <PanelLink href="/panel/user/descargas" icon={<Download size={18} />} onClick={() => setOpen(false)}>
            Descargas
          </PanelLink>

          <PanelLink
            href="/"
            icon={<ArrowLeft size={18} />}
            className="mt-4"
            onClick={() => setOpen(false)}
          >
            Volver a ombim.site
          </PanelLink>
        </nav>
      </aside>

      {/* ====================================
          SIDEBAR DESKTOP
      ==================================== */}
      <aside
        className="
          hidden md:flex flex-col
          w-64 
          bg-white dark:bg-gray-900
          border-r border-gray-300 dark:border-gray-700
          shadow-xl
          p-6 space-y-6
          fixed top-[72px] left-0 bottom-0
          z-20
        "
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Panel Usuario
        </h2>

        <nav className="space-y-2 text-base">
          <PanelLink href="/panel/user" icon={<Home size={18} />}>
            Inicio
          </PanelLink>

          <PanelLink href="/panel/user/licencias" icon={<KeyRound size={18} />}>
            Mis licencias
          </PanelLink>

          <PanelLink href="/panel/user/pagos" icon={<CreditCard size={18} />}>
            Mis pagos
          </PanelLink>

          <PanelLink href="/panel/user/mis-datos" icon={<User size={18} />}>
            Mis datos
          </PanelLink>

          <PanelLink href="/panel/user/descargas" icon={<Download size={18} />}>
            Descargas
          </PanelLink>

          <PanelLink href="/" icon={<ArrowLeft size={18} />} className="mt-4">
            Volver a ombim.site
          </PanelLink>
        </nav>
      </aside>

      {/* ====================================
          CONTENIDO PRINCIPAL
      ==================================== */}
      <main
        className="
          flex-1 
          overflow-y-auto 
          p-6
          md:ml-64
          bg-gray-50 dark:bg-gray-800
        "
      >
        {children}
      </main>

    </div>
  );
}

/* ==========================================================
   COMPONENTE PREMIUM PARA LINKS DEL SIDEBAR
========================================================== */
function PanelLink({ href, icon, children, onClick, className = "" }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-3 p-2 rounded-lg
        text-gray-800 dark:text-gray-200
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition
        ${className}
      `}
    >
      {icon}
      {children}
    </Link>
  );
}