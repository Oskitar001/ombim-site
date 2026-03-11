"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Scroll suave para enlaces internos
  useEffect(() => {
    const handler = (e) => {
      const link = e.target.closest("[data-scroll-contacto]");
      if (!link) return;

      // Si NO estamos en la home → navegación normal
      if (window.location.pathname !== "/") return;

      e.preventDefault();

      const target = document.querySelector("#contacto");
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "smooth",
        });
      }

      setOpen(false); // cerrar menú móvil
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <nav className="w-full fixed top-0 left-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">

        {/* LOGO + TEXTO */}
        <a href="/" className="flex items-center gap-3 shrink-0">
          <img
            src="/logo-ombim.png"
            alt="OMBIM Logo"
            className="h-10 w-auto md:h-14 transition-transform duration-300 hover:scale-105 hover:opacity-90"
          />
          <span className="text-xl md:text-3xl font-bold tracking-tight">
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
        <div className="hidden md:flex gap-8 text-lg font-medium">
          <Link href="/" className="hover:text-blue-600 transition">Inicio</Link>

          <Link href="/sobre-mi" className="hover:text-blue-600 transition">Sobre mí</Link>

          <Link href="/servicios" className="hover:text-blue-600 transition">Servicios</Link>

          <Link href="/demos" className="hover:text-blue-600 transition">Demos</Link>

          {/* Scroll suave si estás en Home */}
          <a
            href="/contacto"
            data-scroll-contacto
            className="hover:text-blue-600 transition cursor-pointer"
          >
            Contacto
          </a>
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg px-6 py-4 flex flex-col gap-4 text-lg font-medium">
          <Link href="/" onClick={() => setOpen(false)} className="hover:text-blue-600 transition">Inicio</Link>

          <Link href="/sobre-mi" onClick={() => setOpen(false)} className="hover:text-blue-600 transition">Sobre mí</Link>

          <Link href="/servicios" onClick={() => setOpen(false)} className="hover:text-blue-600 transition">Servicios</Link>

          <Link href="/demos" onClick={() => setOpen(false)} className="hover:text-blue-600 transition">Demos</Link>

          {/* Scroll suave si estás en Home */}
          <a
            href="/contacto"
            data-scroll-contacto
            className="hover:text-blue-600 transition cursor-pointer"
          >
            Contacto
          </a>
        </div>
      )}
    </nav>
  );
}
