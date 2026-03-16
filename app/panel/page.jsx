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
    <div className="max-w-3xl mx-auto pt-32 px-6">
      <h1 className="text-3xl font-bold mb-6">Panel de Usuario</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Información de tu cuenta</h2>

        <p><strong>Nombre:</strong> {user.nombre}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role}</p>
      </div>

      {user.role === "admin" ? (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Opciones de Administrador</h2>

          <ul className="space-y-3">
            <li>
              <Link href="/panel/plugins" className="text-blue-600 hover:underline">
                ➤ Gestionar Plugins
              </Link>
            </li>
            <li>
              <Link href="/panel/subir-plugin" className="text-blue-600 hover:underline">
                ➤ Subir nuevo plugin
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Tus recursos</h2>

          <ul className="space-y-3">
            <li>
              <Link href="/plugins" className="text-green-700 hover:underline">
                ➤ Ver plugins disponibles
              </Link>
            </li>
            <li>
              <Link href="/mis-descargas" className="text-green-700 hover:underline">
                ➤ Mis descargas
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
