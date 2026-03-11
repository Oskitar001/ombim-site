"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full py-4 bg-white shadow fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">

        {/* LOGO + TEXTO */}
        <a href="/" className="flex items-center gap-3 shrink-0">
          <img
            src="/logo-ombim.png"
            alt="OMBIM Logo"
            className="h-10 w-auto md:h-16 transition-transform duration-300 hover:scale-105 hover:opacity-90"
          />
          <span className="text-xl md:text-3xl font-bold whitespace-nowrap">
            OMBIM
          </span>
        </a>

        {/* BOTÓN HAMBURGUESA (solo móvil) */}
        <button
          className="md:hidden flex flex-col gap-1"
          onClick={() => setOpen(!open)}
        >
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
        </button>

        {/* MENÚ ESCRITORIO */}
        <div className="hidden md:flex gap-6 text-lg">
          <a href="/" className="hover:text-blue-600 transition">Inicio</a>
          <Link href="/sobre-mi" className="hover:text-blue-600 transition">Sobre mí</Link>
          <Link href="/servicios" className="hover:text-blue-600 transition">Servicios</Link>
          <Link href="/demos" className="hover:text-blue-600 transition">Demos</Link>
          <Link href="/contacto" className="hover:text-blue-600 transition">Contacto</Link>
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {open && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4 flex flex-col gap-4 text-lg">
          <a href="/" className="hover:text-blue-600 transition">Inicio</a>
          <Link href="/sobre-mi" className="hover:text-blue-600 transition">Sobre mí</Link>
          <Link href="/servicios" className="hover:text-blue-600 transition">Servicios</Link>
          <Link href="/demos" className="hover:text-blue-600 transition">Demos</Link>
          <Link href="/contacto" className="hover:text-blue-600 transition">Contacto</Link>
        </div>
      )}
    </nav>
  );
}