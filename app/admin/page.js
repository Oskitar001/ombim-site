"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setLoading(true);

    const resUsers = await fetch("/api/admin/usuarios");
    const dataUsers = await resUsers.json();

    const resDisp = await fetch("/api/admin/dispositivos");
    const dataDisp = await resDisp.json();

    const resLogs = await fetch("/api/admin/logs");
    const dataLogs = await resLogs.json();

    setUsuarios(dataUsers);
    setDispositivos(dataDisp);
    setLogs(dataLogs);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600 text-xl">
        Cargando dashboard...
      </div>
    );
  }

  // Estadísticas
  const activos = usuarios.filter(u => u.estado === "activo").length;
  const suspendidos = usuarios.filter(u => u.estado === "suspendido").length;

  const expirados = usuarios.filter(u => {
    const hoy = new Date();
    const exp = new Date(u.fecha_expiracion);
    return exp < hoy;
  }).length;

  const totalDispositivos = dispositivos.length;

  // Nuevos usuarios por mes (últimos 6 meses)
  const meses = {};
  usuarios.forEach(u => {
    const fecha = new Date(u.fecha_creacion);
    const clave = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
    meses[clave] = (meses[clave] || 0) + 1;
  });

  const ultimosMeses = Object.entries(meses)
    .sort()
    .slice(-6);

  return (
    <div className="min-h-screen bg-gray-100">

      <header className="bg-white shadow p-5 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>

        <a
          href="/api/admin/logout"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Cerrar sesión
        </a>
      </header>

      <main className="p-10 max-w-6xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-500">Usuarios totales</p>
            <p className="text-3xl font-bold">{usuarios.length}</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-500">Activos</p>
            <p className="text-3xl font-bold text-green-600">{activos}</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-500">Suspendidos</p>
            <p className="text-3xl font-bold text-red-600">{suspendidos}</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-500">Expirados</p>
            <p className="text-3xl font-bold text-yellow-600">{expirados}</p>
          </div>
        </div>

        {/* Dispositivos */}
        <div className="bg-white p-6 rounded shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">Dispositivos totales</h2>
          <p className="text-3xl font-bold">{totalDispositivos}</p>
        </div>

        {/* Nuevos usuarios por mes */}
        <div className="bg-white p-6 rounded shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">Nuevos usuarios por mes</h2>

          <div className="grid grid-cols-6 gap-4">
            {ultimosMeses.map(([mes, cantidad]) => (
              <div key={mes} className="text-center">
                <p className="text-gray-500">{mes}</p>
                <div className="bg-blue-600 h-20 rounded" style={{ height: `${cantidad * 20}px` }}></div>
                <p className="font-bold">{cantidad}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Últimos usuarios */}
        <div className="bg-white p-6 rounded shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">Últimos usuarios creados</h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Estado</th>
                <th className="p-2 border">Dispositivos</th>
                <th className="p-2 border">Creado</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.slice(0, 5).map((u) => (
                <tr key={u.id} className="border hover:bg-gray-50">
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border capitalize">{u.estado}</td>
                  <td className="p-2 border">{u.dispositivos_usados}/{u.max_dispositivos}</td>
                  <td className="p-2 border">
                    {new Date(u.fecha_creacion).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Últimos logs */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Últimos logs</h2>

          {logs.length === 0 ? (
            <p className="text-gray-600">No hay logs registrados.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2 border">Usuario</th>
                  <th className="p-2 border">Acción</th>
                  <th className="p-2 border">Hardware ID</th>
                  <th className="p-2 border">Fecha</th>
                </tr>
              </thead>

              <tbody>
                {logs.slice(0, 5).map((l) => (
                  <tr key={l.id} className="border hover:bg-gray-50">
                    <td className="p-2 border">{l.email}</td>
                    <td className="p-2 border">{l.accion}</td>
                    <td className="p-2 border">{l.hardwareId}</td>
                    <td className="p-2 border">
                      {new Date(l.fecha).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </div>
  );
}
