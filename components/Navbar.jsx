"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setReady(true);
  }, []);

  if (!ready) return null;

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="w-full py-4 bg-white shadow fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img
            src="/logo-ombim.png"
            alt="OMBIM Logo"
            className="h-10 w-auto md:h-16 transition-transform duration-300 hover:scale-105 hover:opacity-90"
          />
          <span className="text-xl md:text-3xl font-bold whitespace-nowrap">
            OMBIM
          </span>
        </Link>

        {/* HAMBURGUESA */}
        <button
          className="md:hidden flex flex-col gap-1"
          onClick={() => setOpen(!open)}
        >
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
        </button>

        {/* MENÚ ESCRITORIO */}
        <div className="hidden md:flex gap-6 text-lg items-center">
          <Link href="/" className="hover:text-blue-600 transition">Inicio</Link>
          <Link href="/sobre-mi" className="hover:text-blue-600 transition">Sobre mí</Link>
          <Link href="/servicios" className="hover:text-blue-600 transition">Servicios</Link>
          <Link href="/demos" className="hover:text-blue-600 transition">Demos</Link>
          <Link href="/contacto" className="hover:text-blue-600 transition">Contacto</Link>

          {/* USUARIO LOGUEADO */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 hover:text-blue-600 transition">
                <svg width="26" height="26" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                </svg>
                {user.name || "Usuario"}
              </button>

              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-3 w-40 hidden group-hover:block">
                <Link href="/panel" className="block px-3 py-2 hover:bg-gray-100 rounded">
                  Panel
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/acceso"
              className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition flex items-center gap-2"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
              </svg>
              Inicia sesión o regístrate
            </Link>
          )}
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {open && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4 flex flex-col gap-4 text-lg">
          <Link href="/" className="hover:text-blue-600 transition">Inicio</Link>
          <Link href="/sobre-mi" className="hover:text-blue-600 transition">Sobre mí</Link>
          <Link href="/servicios" className="hover:text-blue-600 transition">Servicios</Link>
          <Link href="/demos" className="hover:text-blue-600 transition">Demos</Link>
          <Link href="/contacto" className="hover:text-blue-600 transition">Contacto</Link>

          {user ? (
            <>
              <Link href="/panel" className="hover:text-blue-600 transition">Panel</Link>
              <button onClick={logout} className="text-left hover:text-blue-600 transition">
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/acceso"
              className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition flex items-center gap-2"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
              </svg>
              Inicia sesión o regístrate
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
