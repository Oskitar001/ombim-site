export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4">
        <h1 className="text-xl font-bold">Panel de Administración</h1>
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
}
