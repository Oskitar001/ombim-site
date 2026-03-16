"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);       // menú hamburguesa
  const [menuOpen, setMenuOpen] = useState(false); // menú avatar
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const [theme, setTheme] = useState("light"); // ⭐ tema

  const menuRef = useRef(null);

  // Cargar usuario desde la cookie (vía API)
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  // ⭐ Cargar tema desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  // ⭐ Cambiar tema
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

  // ⭐ Cerrar hamburguesa y menú avatar al cambiar de ruta
  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Logout
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMenuOpen(false);
    setOpen(false);
    router.push("/");
  };

  if (!ready) return null;

  // Avatar redondo con inicial
  const avatar = user?.nombre
    ? user.nombre.charAt(0).toUpperCase()
    : "U";

  return (
    <nav className="w-full py-4 bg-white dark:bg-[#111] shadow fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">

        {/* LOGO */}
        <Link href="/" prefetch={false} className="flex items-center gap-3 shrink-0">
          <img src="/logo-ombim.png" alt="OMBIM Logo" className="h-10 w-auto md:h-16" />
          <span className="text-xl md:text-3xl font-bold whitespace-nowrap dark:text-white">OMBIM</span>
        </Link>

        {/* HAMBURGUESA */}
        <button className="md:hidden flex flex-col gap-1" onClick={() => setOpen(!open)}>
          <span className="w-6 h-0.5 bg-gray-800 dark:bg-white"></span>
          <span className="w-6 h-0.5 bg-gray-800 dark:bg-white"></span>
          <span className="w-6 h-0.5 bg-gray-800 dark:bg-white"></span>
        </button>

        {/* MENÚ ESCRITORIO */}
        <div className="hidden md:flex gap-6 text-lg items-center dark:text-white">
          <Link href="/" className="hover:text-blue-600 transition">Inicio</Link>
          <Link href="/sobre-mi" className="hover:text-blue-600 transition">Sobre mí</Link>
          <Link href="/servicios" className="hover:text-blue-600 transition">Servicios</Link>
          <Link href="/plugins" className="hover:text-blue-600 transition">Plugins</Link>
          <Link href="/demos" className="hover:text-blue-600 transition">Demos</Link>
          <Link href="/contacto" className="hover:text-blue-600 transition">Contacto</Link>

          {/* ⭐ SWITCH TEMA ESCRITORIO */}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {theme === "light" ? "🌙 Oscuro" : "☀️ Claro"}
          </button>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 hover:text-blue-600 transition"
              >
                <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {avatar}
                </div>
                {user.nombre}
              </button>

              {/* MENÚ ANIMADO */}
              <div
                className={`
                  absolute right-0 mt-2 bg-white dark:bg-[#222] shadow-lg rounded-lg p-3 w-40 z-50
                  transition-all duration-200 origin-top-right
                  ${menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
                `}
              >
                <Link
                  href="/panel"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded dark:text-white"
                >
                  Panel
                </Link>

                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded dark:text-white"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-gray-200 dark:bg-gray-700 dark:text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2"
            >
              Inicia sesión o regístrate
            </Link>
          )}
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {open && (
        <div className="md:hidden bg-white dark:bg-[#111] shadow-lg px-6 py-4 flex flex-col gap-4 text-lg dark:text-white">
          <Link href="/" onClick={() => setOpen(false)} className="hover:text-blue-600 transition">Inicio</Link>
          <Link href="/sobre-mi" onClick={() => setOpen(false)} className="hover:text-blue-600 transition">Sobre mí</Link>
          <Link href="/servicios" onClick={() => setOpen(false)} className="hover:text-blue-600 transition">Servicios</Link>
          <Link href="/plugins" onClick={() => setOpen(false)} className="hover:text-blue-600 transition">Plugins</Link>
          <Link href="/demos" onClick={() => setOpen(false)} className="hover:text-blue-600 transition">Demos</Link>
          <Link href="/contacto" onClick={() => setOpen(false)} className="hover:text-blue-600 transition">Contacto</Link>

          {/* ⭐ SWITCH TEMA MÓVIL */}
          <button
            onClick={() => { toggleTheme(); setOpen(false); }}
            className="hover:text-blue-600 transition"
          >
            {theme === "light" ? "🌙 Modo oscuro" : "☀️ Modo claro"}
          </button>

          {user ? (
            <>
              <Link href="/panel" onClick={() => setOpen(false)} className="hover:text-blue-600 transition">Panel</Link>
              <button onClick={logout} className="text-left hover:text-blue-600 transition">
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="bg-gray-200 dark:bg-gray-700 dark:text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2"
            >
              Inicia sesión o regístrate
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
