export default function EmpresaLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Panel Empresa</h2>

        <nav className="flex flex-col gap-3">
          <a href="/empresa" className="text-gray-700 hover:text-black">Dashboard</a>
          <a href="/empresa/licencias" className="text-gray-700 hover:text-black">Licencias</a>
          <a href="/empresa/empleados" className="text-gray-700 hover:text-black">Empleados</a>
          <a href="/empresa/dispositivos" className="text-gray-700 hover:text-black">Dispositivos</a>
          <a href="/empresa/logs" className="text-gray-700 hover:text-black">Logs</a>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
