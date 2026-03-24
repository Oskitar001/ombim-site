"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState("light");

  

  const menuRef = useRef(null);

  // Obtener usuario
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user ?? null);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  // Cargar tema desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Cerrar menú usuario al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Cerrar menús al navegar
  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Evitar scroll cuando menú móvil está abierto
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
  }, [open]);

  // Logout
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  if (!ready) return null;
  console.log("USER METADATA:", user?.user_metadata);
  const role = user?.user_metadata?.role;
  const panelUrl = role === "admin" ? "/panel/admin" : "/panel/user";

  const nombre = user?.user_metadata?.nombre;
  const avatar =
    nombre?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase();

  return (
    <nav className="w-full py-4 bg-[#f3f4f6] dark:bg-[#242424] border-b border-gray-300 dark:border-gray-700 fixed top-0 left-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img
            src="/logo-ombim.png"
            alt="OMBIM Logo"
            className="h-10 w-auto md:h-14 block dark:hidden"
          />
          <img
            src="/logo-ombim-dark.png"
            alt="OMBIM Logo Dark"
            className="h-10 w-auto md:h-14 hidden dark:block"
          />
          <span className="text-xl md:text-3xl font-bold text-[#1f2937] dark:text-[#e6e6e6]">
            OMBIM
          </span>
        </Link>

        {/* BOTÓN HAMBURGUESA */}
        <button
          className="md:hidden relative w-8 h-8 flex items-center justify-center"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          <span
            className={`absolute h-0.5 bg-black dark:bg-white rounded-full transition-all ${
              open ? "w-6 rotate-45" : "w-7 -translate-y-2"
            }`}
          />
          <span
            className={`absolute h-0.5 bg-black dark:bg-white rounded-full transition-all ${
              open ? "opacity-0" : "opacity-100 w-7"
            }`}
          />
          <span
            className={`absolute h-0.5 bg-black dark:bg-white rounded-full transition-all ${
              open ? "w-6 -rotate-45" : "w-7 translate-y-2"
            }`}
          />
        </button>

        {/* MENÚ DESKTOP */}
        <div className="hidden md:flex gap-6 items-center text-lg text-[#1f2937] dark:text-[#e6e6e6]">

          <Link href="/" className="hover:text-blue-600 transition">Inicio</Link>
          <Link href="/sobre-mi" className="hover:text-blue-600 transition">Sobre mí</Link>
          <Link href="/servicios" className="hover:text-blue-600 transition">Servicios</Link>
          <Link href="/plugins" className="hover:text-blue-600 transition">Plugins</Link>
          <Link href="/demos" className="hover:text-blue-600 transition">Demos</Link>
          <Link href="/contacto" className="hover:text-blue-600 transition">Contacto</Link>

          {/* CAMBIAR TEMA */}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-lg border bg-white dark:bg-[#2e2e2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3a] transition"
          >
            {theme === "light" ? "🌙 Oscuro" : "☀️ Claro"}
          </button>

          {/* MENÚ USUARIO DESKTOP */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 hover:text-blue-600 transition"
              >
                <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {avatar}
                </div>
                <span>{nombre}</span>
              </button>

              <div
                className={`absolute right-0 mt-2 bg-white dark:bg-[#2e2e2e] border border-gray-200 dark:border-gray-600 rounded-lg p-3 w-40 shadow-lg transition-all origin-top-right ${
                  menuOpen
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <Link
                  href={panelUrl}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 hover:bg-gray-200 dark:hover:bg-[#3a3a3a] rounded"
                >
                  Panel
                </Link>

                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-200 dark:hover:bg-[#3a3a3a] rounded"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="border px-4 py-2 rounded-lg bg-white dark:bg-[#2e2e2e] hover:bg-gray-100 dark:hover:bg-[#3a3a3a] transition"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {open && (
        <div className="md:hidden bg-[#f3f4f6] dark:bg-[#2e2e2e] border-t px-6 py-4 flex flex-col gap-4 text-lg text-[#1f2937] dark:text-[#e6e6e6]">

          <Link href="/" onClick={() => setOpen(false)}>Inicio</Link>
          <Link href="/sobre-mi" onClick={() => setOpen(false)}>Sobre mí</Link>
          <Link href="/servicios" onClick={() => setOpen(false)}>Servicios</Link>
          <Link href="/plugins" onClick={() => setOpen(false)}>Plugins</Link>
          <Link href="/demos" onClick={() => setOpen(false)}>Demos</Link>
          <Link href="/contacto" onClick={() => setOpen(false)}>Contacto</Link>

          <button onClick={() => { toggleTheme(); setOpen(false); }}>
            {theme === "light" ? "🌙 Modo oscuro" : "☀️ Modo claro"}
          </button>

          {user ? (
            <>
              <Link href={panelUrl} onClick={() => setOpen(false)}>Panel</Link>
              <button onClick={logout}>Cerrar sesión</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)}>Iniciar sesión</Link>
          )}
        </div>
      )}
    </nav>
  );
}