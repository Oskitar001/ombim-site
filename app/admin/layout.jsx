// app/admin/layout.jsx
"use client";

export default function AdminLayout({ children }) {
  async function logout() {
    await fetch("/api/admin/logout");
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 p-6">
        <h2 className="text-xl font-bold mb-6">Admin</h2>

        <nav className="space-y-3">
          <a href="/admin/dashboard" className="block hover:text-neutral-300">Dashboard</a>
          <a href="/admin/usuarios" className="block hover:text-neutral-300">Usuarios</a>
          <a href="/admin/usuarios/nuevo" className="block hover:text-neutral-300">Crear usuario</a>
          <a href="/admin/dispositivos" className="block hover:text-neutral-300">Dispositivos</a>
          <a href="/admin/logs" className="block hover:text-neutral-300">Logs</a>

          <button
            onClick={logout}
            className="mt-6 text-red-400 hover:text-red-300"
          >
            Cerrar sesión
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
