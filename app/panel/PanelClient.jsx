// ===============================
// app/panel/PanelClient.jsx
// ===============================
"use client";
import Link from "next/link";

export default function PanelClient({ user }) {
  const nombre = user.user_metadata?.nombre || "Usuario";
  const role = user.user_metadata?.role || "user";

  return (
    <div className="max-w-3xl mx-auto pt-32 px-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Panel de Usuario</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-10">
        <p><strong>Nombre:</strong> {nombre}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {role}</p>

        {/* 🔥 Botón para editar usuario */}
        <div className="mt-4">
          <Link
            href="/panel/editar"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Editar usuario
          </Link>
        </div>
      </div>

      {role === "admin" ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Opciones de Administrador</h2>
          <ul className="space-y-3">
            <li><Link href="/admin/plugins">➤ Gestionar Plugins</Link></li>
            <li><Link href="/panel/subir-plugin">➤ Subir nuevo plugin</Link></li>
            <li><Link href="/admin/licencias">➤ Gestionar Licencias</Link></li>
            <li><Link href="/admin/users">➤ Gestionar Usuarios</Link></li>
            <li><Link href="/admin/hardware">➤ Gestionar Hardware</Link></li>
            <li><Link href="/admin/logs">➤ Ver Logs del Sistema</Link></li>
          </ul>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Tus recursos</h2>
          <ul className="space-y-3">
            <li><Link href="/plugins">➤ Ver plugins disponibles</Link></li>
            <li><Link href="/mis-descargas">➤ Mis descargas</Link></li>
          </ul>
        </div>
      )}
    </div>
  );
}
