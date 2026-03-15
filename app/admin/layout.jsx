export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Panel Admin</h2>

        <nav className="flex flex-col gap-3">
          <a href="/admin" className="text-gray-700 hover:text-black">Dashboard</a>
          <a href="/admin/empresas" className="text-gray-700 hover:text-black">Empresas</a>
          <a href="/admin/licencias" className="text-gray-700 hover:text-black">Licencias</a>
          <a href="/admin/empleados" className="text-gray-700 hover:text-black">Empleados</a>
          <a href="/admin/dispositivos" className="text-gray-700 hover:text-black">Dispositivos</a>
          <a href="/admin/logs" className="text-gray-700 hover:text-black">Logs</a>
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
