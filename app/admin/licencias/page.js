"use client";

import { useEffect, useState } from "react";

export default function LicenciasAdmin() {
  const [licencias, setLicencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    cargarLicencias();
  }, []);

  async function cargarLicencias() {
    setLoading(true);
    const res = await fetch("/api/admin/licencias");
    const data = await res.json();
    setLicencias(data);
    setLoading(false);
  }

  async function crearLicencia() {
    if (!email) return;

    await fetch("/api/admin/crear-licencia", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    setEmail("");
    cargarLicencias();
  }

  async function revocar(id) {
    await fetch("/api/admin/revocar", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    cargarLicencias();
  }

  async function extender(id) {
    await fetch("/api/admin/extender", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    cargarLicencias();
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white shadow p-5 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Panel de Licencias</h1>

        <a
          href="/api/admin/logout"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Cerrar sesión
        </a>
      </header>

      <main className="p-10 max-w-6xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-500">Total licencias</p>
            <p className="text-3xl font-bold">{licencias.length}</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-500">Activas</p>
            <p className="text-3xl font-bold">
              {licencias.filter(l => l.estado === "activa").length}
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-500">Revocadas</p>
            <p className="text-3xl font-bold">
              {licencias.filter(l => l.estado === "revocada").length}
            </p>
          </div>
        </div>

        {/* Crear licencia */}
        <div className="bg-white p-6 rounded shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">Crear licencia de pago</h2>

          <div className="flex gap-3">
            <input
              className="border p-2 rounded w-80"
              placeholder="Email del cliente"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={crearLicencia}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Crear
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Licencias registradas</h2>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Tipo</th>
                  <th className="p-2 border">Estado</th>
                  <th className="p-2 border">Expiración</th>
                  <th className="p-2 border">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {licencias.map((l) => (
                  <tr key={l.id} className="border hover:bg-gray-50">
                    <td className="p-2 border">{l.email}</td>
                    <td className="p-2 border capitalize">{l.tipo}</td>
                    <td className="p-2 border capitalize">{l.estado}</td>
                    <td className="p-2 border">
                      {new Date(l.expiracion).toLocaleDateString()}
                    </td>

                    <td className="p-2 border flex gap-2">
                      <button
                        onClick={() => revocar(l.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Revocar
                      </button>

                      <button
                        onClick={() => extender(l.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                      >
                        +1 año
                      </button>

                      <a
                        href={`/admin/licencias/${l.id}`}
                        className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800 transition"
                      >
                        Ver activaciones
                      </a>
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
