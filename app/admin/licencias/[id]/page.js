"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ActivacionesPage() {
  const { id } = useParams();
  const [licencia, setLicencia] = useState(null);
  const [activaciones, setActivaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setLoading(true);

    const resLic = await fetch(`/api/admin/licencia?id=${id}`);
    const dataLic = await resLic.json();

    const resAct = await fetch(`/api/admin/activaciones?id=${id}`);
    const dataAct = await resAct.json();

    setLicencia(dataLic);
    setActivaciones(dataAct);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600 text-xl">
        Cargando datos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white shadow p-5 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Activaciones de Licencia</h1>

        <a
          href="/admin/licencias"
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Volver al panel
        </a>
      </header>

      <main className="p-10 max-w-5xl mx-auto">

        {/* Tarjeta de licencia */}
        <div className="bg-white p-6 rounded shadow mb-10">
          <h2 className="text-2xl font-semibold mb-4">Información de la licencia</h2>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500">Email</p>
              <p className="text-lg font-semibold">{licencia.email}</p>
            </div>

            <div>
              <p className="text-gray-500">Tipo</p>
              <p className="text-lg font-semibold capitalize">{licencia.tipo}</p>
            </div>

            <div>
              <p className="text-gray-500">Estado</p>
              <p className={`text-lg font-semibold capitalize ${
                licencia.estado === "activa" ? "text-green-600" : "text-red-600"
              }`}>
                {licencia.estado}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Expiración</p>
              <p className="text-lg font-semibold">
                {new Date(licencia.expiracion).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tabla de activaciones */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Activaciones registradas</h2>

          {activaciones.length === 0 ? (
            <p className="text-gray-600">No hay activaciones registradas.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2 border">Hardware ID</th>
                  <th className="p-2 border">Fecha</th>
                </tr>
              </thead>

              <tbody>
                {activaciones.map((a) => (
                  <tr key={a.id} className="border hover:bg-gray-50">
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
