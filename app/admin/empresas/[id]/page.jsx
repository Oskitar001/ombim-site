"use client";

import { useState, useEffect } from "react";

export default function EditarEmpresa({ params }) {
  const id = params.id;

  const [empresa, setEmpresa] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/empresas/${id}`)
      .then((res) => res.json())
      .then((data) => setEmpresa(data));
  }, [id]);

  async function guardar() {
    const res = await fetch(`/api/admin/empresas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empresa),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }

    window.location.href = "/admin/empresas";
  }

  async function eliminar() {
    if (!confirm("¿Eliminar empresa?")) return;

    await fetch(`/api/admin/empresas/${id}`, { method: "DELETE" });

    window.location.href = "/admin/empresas";
  }

  if (!empresa) return <p>Cargando...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Editar empresa</h1>

      {error && <p className="bg-red-100 text-red-700 p-3 mb-4">{error}</p>}

      <input
        className="w-full p-3 border rounded mb-4"
        value={empresa.nombre}
        onChange={(e) => setEmpresa({ ...empresa, nombre: e.target.value })}
      />

      <input
        className="w-full p-3 border rounded mb-4"
        value={empresa.email}
        onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })}
      />

      <input
        className="w-full p-3 border rounded mb-4"
        placeholder="Nueva contraseña (opcional)"
        onChange={(e) =>
          setEmpresa({ ...empresa, password_hash: e.target.value })
        }
      />

      <select
        className="w-full p-3 border rounded mb-6"
        value={empresa.estado}
        onChange={(e) => setEmpresa({ ...empresa, estado: e.target.value })}
      >
        <option value="activa">Activa</option>
        <option value="suspendida">Suspendida</option>
      </select>

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
