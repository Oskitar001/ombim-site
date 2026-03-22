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

  // Cargar usuario
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  // Cargar tema
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  // Cambiar tema
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cerrar menús al navegar
  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Bloquear scroll en móvil
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
  }, [open]);

  // Logout
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMenuOpen(false);
    setOpen(false);
    router.push("/");
  };

  if (!ready) return null;

  // ⭐ Obtener nombre real desde user_metadata
  const nombre = user?.user_metadata?.nombre;

  // ⭐ Avatar: inicial del nombre o inicial del email
  const avatar = nombre
    ? nombre.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase();

  return (
    <nav className="w-full py-4 bg-[#f3f4f6] dark:bg-[#242424] shadow-soft dark:shadow-none border-b border-[#d1d5db] dark:border-[#3a3a3a] fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">

        {/* LOGO */}
        <Link href="/" prefetch={false} className="flex items-center gap-3 shrink-0">
          <img
            src="/logo-ombim.png"
            alt="OMBIM Logo"
            className="h-10 w-auto md:h-16 block dark:hidden"
          />
          <img
            src="/logo-ombim-dark.png"
            alt="OMBIM Logo Dark"
            className="h-10 w-auto md:h-16 hidden dark:block"
          />
          <span className="text-xl md:text-3xl font-bold whitespace-nowrap text-[#1f2937] dark:text-[#e6e6e6]">
            OMBIM
          </span>
        </Link>

        {/* HAMBURGUESA */}
        <button
          className="md:hidden relative w-8 h-8 flex items-center justify-center"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          <span className={`absolute h-0.5 bg-black dark:bg-white rounded-full transition-all duration-300 ${open ? "w-6 rotate-45 translate-y-0" : "w-7 -translate-y-2"}`}></span>
          <span className={`absolute h-0.5 bg-black dark:bg-white rounded-full transition-all duration-300 ${open ? "w-0 opacity-0" : "w-7 opacity-100"}`}></span>
          <span className={`absolute h-0.5 bg-black dark:bg-white rounded-full transition-all duration-300 ${open ? "w-6 -rotate-45 translate-y-0" : "w-7 translate-y-2"}`}></span>
        </button>

        {/* MENÚ ESCRITORIO */}
        <div className="hidden md:flex gap-6 text-lg items-center text-[#1f2937] dark:text-[#e6e6e6]">
          <Link href="/" className="hover:text-brand transition">Inicio</Link>
          <Link href="/sobre-mi" className="hover:text-brand transition">Sobre mí</Link>
          <Link href="/servicios" className="hover:text-brand transition">Servicios</Link>
          <Link href="/plugins" className="hover:text-brand transition">Plugins</Link>
          <Link href="/demos" className="hover:text-brand transition">Demos</Link>
          <Link href="/contacto" className="hover:text-brand transition">Contacto</Link>

          {/* SWITCH TEMA */}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-lg bg-[#ffffff] dark:bg-[#2e2e2e] border border-[#d1d5db] dark:border-[#3a3a3a] hover:bg-[#e5e7eb] dark:hover:bg-[#3a3a3a] transition"
          >
            {theme === "light" ? "🌙 Oscuro" : "☀️ Claro"}
          </button>

          {/* ⭐ USUARIO */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 hover:text-brand transition"
              >
                <div className="w-9 h-9 bg-brand text-white rounded-full flex items-center justify-center font-bold">
                  {avatar}
                </div>

                {/* ⭐ Mostrar nombre */}
                <span>{user.user_metadata?.nombre}</span>
              </button>

              <div
                className={`
                  absolute right-0 mt-2 bg-[#ffffff] dark:bg-[#2e2e2e]
                  border border-[#d1d5db] dark:border-[#3a3a3a]
                  shadow-soft rounded-lg p-3 w-40 z-50
                  transition-all duration-200 origin-top-right
                  ${menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
                `}
              >
                <Link
                  href="/panel"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 hover:bg-[#f3f4f6] dark:hover:bg-[#3a3a3a] rounded"
                >
                  Panel
                </Link>

                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 hover:bg-[#f3f4f6] dark:hover:bg-[#3a3a3a] rounded"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#ffffff] dark:bg-[#2e2e2e] border border-[#d1d5db] dark:border-[#3a3a3a] px-4 py-2 rounded-lg font-medium hover:bg-[#e5e7eb] dark:hover:bg-[#3a3a3a] transition"
            >
              Inicia sesión o regístrate
            </Link>
          )}
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {open && (
        <div className="md:hidden bg-[#f3f4f6] dark:bg-[#2e2e2e] shadow-lg px-6 py-4 flex flex-col gap-4 text-lg text-[#1f2937] dark:text-[#e6e6e6] border-t border-[#d1d5db] dark:border-[#3a3a3a]">
          <Link href="/" onClick={() => setOpen(false)} className="hover:text-brand transition">Inicio</Link>
          <Link href="/sobre-mi" onClick={() => setOpen(false)} className="hover:text-brand transition">Sobre mí</Link>
          <Link href="/servicios" onClick={() => setOpen(false)} className="hover:text-brand transition">Servicios</Link>
          <Link href="/plugins" onClick={() => setOpen(false)} className="hover:text-brand transition">Plugins</Link>
          <Link href="/demos" onClick={() => setOpen(false)} className="hover:text-brand transition">Demos</Link>
          <Link href="/contacto" onClick={() => setOpen(false)} className="hover:text-brand transition">Contacto</Link>

          {/* SWITCH TEMA */}
          <button
            onClick={() => { toggleTheme(); setOpen(false); }}
            className="hover:text-brand transition"
          >
            {theme === "light" ? "🌙 Modo oscuro" : "☀️ Modo claro"}
          </button>

          {user ? (
            <>
              <Link href="/panel" onClick={() => setOpen(false)} className="hover:text-brand transition">Panel</Link>
              <button onClick={logout} className="text-left hover:text-brand transition">
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="bg-[#ffffff] dark:bg-[#2e2e2e] border border-[#d1d5db] dark:border-[#3a3a3a] px-4 py-2 rounded-lg font-medium hover:bg-[#e5e7eb] dark:hover:bg-[#3a3a3a] transition"
            >
              Inicia sesión o regístrate
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
