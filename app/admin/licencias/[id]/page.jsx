"use client";

import { useState, useEffect } from "react";

export default function EditarLicencia({ params }) {
  const id = params.id;

  const [licencia, setLicencia] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/licencias/${id}`)
      .then((res) => res.json())
      .then((data) => setLicencia(data));

    fetch("/api/admin/empresas")
      .then((res) => res.json())
      .then((data) => setEmpresas(data));
  }, [id]);

  async function guardar() {
    const res = await fetch(`/api/admin/licencias/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(licencia),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }

    window.location.href = "/admin/licencias";
  }

  async function eliminar() {
    if (!confirm("¿Eliminar licencia?")) return;

    await fetch(`/api/admin/licencias/${id}`, { method: "DELETE" });

    window.location.href = "/admin/licencias";
  }

  if (!licencia) return <p>Cargando...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Editar licencia</h1>

      {error && <p className="bg-red-100 text-red-700 p-3 mb-4">{error}</p>}

      <label className="block mb-4">
        Empresa:
        <select
          className="w-full p-3 border rounded mt-2"
          value={licencia.empresa_id}
          onChange={(e) =>
            setLicencia({ ...licencia, empresa_id: e.target.value })
          }
        >
          {empresas.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
      </label>

      <label className="block mb-4">
        Plugin:
        <input
          className="w-full p-3 border rounded mt-2"
          value={licencia.plugin}
          onChange={(e) =>
            setLicencia({ ...licencia, plugin: e.target.value })
          }
        />
      </label>

      <label className="block mb-4">
        Cantidad:
        <input
          type="number"
          className="w-full p-3 border rounded mt-2"
          value={licencia.cantidad}
          onChange={(e) =>
            setLicencia({ ...licencia, cantidad: e.target.value })
          }
        />
      </label>

      <label className="block mb-4">
        Fecha expiración:
        <input
          type="date"
          className="w-full p-3 border rounded mt-2"
          value={licencia.fecha_expiracion.split("T")[0]}
          onChange={(e) =>
            setLicencia({ ...licencia, fecha_expiracion: e.target.value })
          }
        />
      </label>

      <label className="block mb-6">
        Estado:
        <select
          className="w-full p-3 border rounded mt-2"
          value={licencia.estado}
          onChange={(e) =>
            setLicencia({ ...licencia, estado: e.target.value })
          }
        >
          <option value="activa">Activa</option>
          <option value="suspendida">Suspendida</option>
        </select>
      </label>

      <div className="flex gap-4">
        <button
          onClick={guardar}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Guardar cambios
        </button>

        <button
          onClick={eliminar}
          className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
