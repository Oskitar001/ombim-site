"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PanelPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!data.user) router.push("/login");
        else setUser(data.user);
        setReady(true);
      });
  }, []);

  if (!ready) return null;

  return (
    <div className="max-w-3xl mx-auto pt-32 px-6 bg-[#f3f4f6]Soft dark:bg-[#242424] min-h-screen">

      <h1 className="text-3xl font-bold mb-6 text-[#1f2937] dark:text-[#e6e6e6]">
        Panel de Usuario
      </h1>

      <div className="bg-[#f3f4f6]Soft dark:bg-[#1a1a1a] shadow rounded-lg p-6 mb-10 border border-[#d1d5db] dark:border-[#3a3a3a]">
        <h2 className="text-xl font-semibold mb-4 text-[#1f2937] dark:text-[#e6e6e6]">
          Información de tu cuenta
        </h2>

        <p className="text-[#1f2937] dark:text-[#e6e6e6]">
          <strong className="text-[#1f2937] dark:text-[#e6e6e6]">Nombre:</strong> {user.nombre}
        </p>
        <p className="text-[#1f2937] dark:text-[#e6e6e6]">
          <strong className="text-[#1f2937] dark:text-[#e6e6e6]">Email:</strong> {user.email}
        </p>
        <p className="text-[#1f2937] dark:text-[#e6e6e6]">
          <strong className="text-[#1f2937] dark:text-[#e6e6e6]">Rol:</strong> {user.role}
        </p>
      </div>

      {user.role === "admin" ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">
            Opciones de Administrador
          </h2>

          <ul className="space-y-3">

            {/* Plugins (ya estaban) */}
            <li>
              <Link href="/panel/plugins" className="text-blue-600 dark:text-blue-400 hover:underline">
                ➤ Gestionar Plugins
              </Link>
            </li>
            <li>
              <Link href="/panel/subir-plugin" className="text-blue-600 dark:text-blue-400 hover:underline">
                ➤ Subir nuevo plugin
              </Link>
            </li>

            {/* Rutas ADMIN reales */}
            <li>
              <Link href="/admin/licencias/list" className="text-blue-600 dark:text-blue-400 hover:underline">
                ➤ Gestionar Licencias
              </Link>
            </li>
            <li>
              <Link href="/admin/users/list" className="text-blue-600 dark:text-blue-400 hover:underline">
                ➤ Gestionar Usuarios
              </Link>
            </li>
            <li>
              <Link href="/admin/hardware/list" className="text-blue-600 dark:text-blue-400 hover:underline">
                ➤ Gestionar Hardware
              </Link>
            </li>
            <li>
              <Link href="/admin/logs/list" className="text-blue-600 dark:text-blue-400 hover:underline">
                ➤ Ver Logs del Sistema
              </Link>
            </li>

          </ul>
        </div>
      ) : (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-300">
            Tus recursos
          </h2>

          <ul className="space-y-3">
            <li>
              <Link href="/plugins" className="text-green-700 dark:text-green-300 hover:underline">
                ➤ Ver plugins disponibles
              </Link>
            </li>
            <li>
              <Link href="/mis-descargas" className="text-green-700 dark:text-green-300 hover:underline">
                ➤ Mis descargas
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
