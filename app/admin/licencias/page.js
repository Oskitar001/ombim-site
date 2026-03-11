"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [licencias, setLicencias] = useState([]);
  const [activaciones, setActivaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setLoading(true);

    const resLic = await fetch("/api/admin/licencias");
    const dataLic = await resLic.json();

    const resAct = await fetch("/api/admin/activaciones-global");
    const dataAct = await resAct.json();

    setLicencias(dataLic);
    setActivaciones(dataAct);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600 text-xl">
        Cargando dashboard...
      </div>
    );
  }

  const activas = licencias.filter(l => l.estado === "activa").length;
  const revocadas = licencias.filter(l => l.estado === "revocada").length;
  const trials = licencias.filter(l => l.tipo === "trial").length;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
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
            <p className="text-gray-500">Total licencias</p>
            <p className="text-3xl font-bold">{licencias.length}</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-500">Activas</p>
            <p className="text-3xl font-bold text-green-600">{activas}</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-500">Revocadas</p>
            <p className="text-3xl font-bold text-red-600">{revocadas}</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-500">Trials</p>
            <p className="text-3xl font-bold text-blue-600">{trials}</p>
          </div>
        </div>

        {/* Enlace al panel */}
        <div className="mb-10">
          <a
            href="/admin/licencias"
            className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition"
          >
            Ir al panel de licencias →
          </a>
        </div>

        {/* Últimas licencias */}
        <div className="bg-white p-6 rounded shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">Últimas licencias creadas</h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Tipo</th>
                <th className="p-2 border">Estado</th>
                <th className="p-2 border">Expiración</th>
              </tr>
            </thead>

            <tbody>
              {licencias.slice(0, 5).map((l) => (
                <tr key={l.id} className="border hover:bg-gray-50">
                  <td className="p-2 border">{l.email}</td>
                  <td className="p-2 border capitalize">{l.tipo}</td>
                  <td className="p-2 border capitalize">{l.estado}</td>
                  <td className="p-2 border">
                    {new Date(l.expiracion).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Últimas activaciones */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Últimas activaciones</h2>

          {activaciones.length === 0 ? (
            <p className="text-gray-600">No hay activaciones registradas.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2 border">Licencia ID</th>
                  <th className="p-2 border">Hardware ID</th>
                  <th className="p-2 border">Fecha</th>
                </tr>
              </thead>

              <tbody>
                {activaciones.slice(0, 5).map((a) => (
                  <tr key={a.id} className="border hover:bg-gray-50">
                    <td className="p-2 border">{a.licenciaId}</td>
                    <td className="p-2 border">{a.hardwareId}</td>
                    <td className="p-2 border">
                      {new Date(a.fecha).toLocaleString()}
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
