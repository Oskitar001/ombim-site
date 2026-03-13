"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  HomeIcon,
  UsersIcon,
  DevicePhoneMobileIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  MoonIcon,
  SunIcon
} from "@heroicons/react/24/outline";

const links = [
  { href: "/admin", label: "Dashboard", icon: HomeIcon },
  { href: "/admin/usuarios", label: "Usuarios", icon: UsersIcon },
  { href: "/admin/usuarios/crear", label: "Crear usuario", icon: PlusCircleIcon },
  { href: "/admin/dispositivos", label: "Dispositivos", icon: DevicePhoneMobileIcon },
  { href: "/admin/logs", label: "Logs", icon: DocumentTextIcon }
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") setDark(true);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-neutral-900 transition-colors">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-64 bg-white dark:bg-neutral-950 shadow-xl border-r border-gray-200 dark:border-neutral-800 p-6"
      >
        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
          OMBIM Admin
        </h2>

        <nav className="space-y-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${
                pathname === href
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>
      </motion.aside>

      {/* Main content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 p-10"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Panel de administración
          </h1>

          <div className="flex items-center gap-4">
            {/* Switch tema */}
            <button
              onClick={() => setDark((d) => !d)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-gray-100 transition"
            >
              <motion.div
                layout
                className="w-6 h-6 rounded-full bg-white dark:bg-black flex items-center justify-center"
              >
                {dark ? (
                  <MoonIcon className="w-4 h-4 text-yellow-300" />
                ) : (
                  <SunIcon className="w-4 h-4 text-yellow-500" />
                )}
              </motion.div>
              <span className="text-sm">{dark ? "Oscuro" : "Claro"}</span>
            </button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <span className="text-gray-600 dark:text-gray-300">
                Administrador
              </span>
              <div className="w-10 h-10 bg-gray-300 dark:bg-neutral-700 rounded-full" />
            </motion.div>
          </div>
        </div>

        {children}
      </motion.main>
    </div>
  );
}
