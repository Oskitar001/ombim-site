"use client";

import { useState, useEffect } from "react";

export default function EditarEmpleado({ params }) {
  const id = params.id;

  const [empleado, setEmpleado] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/empleados/${id}`)
      .then((res) => res.json())
      .then((data) => setEmpleado(data));

    fetch("/api/admin/empresas")
      .then((res) => res.json())
      .then((data) => setEmpresas(data));
  }, [id]);

  async function guardar() {
    const res = await fetch(`/api/admin/empleados/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empleado),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }

    window.location.href = "/admin/empleados";
  }

  async function eliminar() {
    if (!confirm("¿Eliminar empleado?")) return;

    await fetch(`/api/admin/empleados/${id}`, { method: "DELETE" });

    window.location.href = "/admin/empleados";
  }

  if (!empleado) return <p>Cargando...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Editar empleado</h1>

      {error && <p className="bg-red-100 text-red-700 p-3 mb-4">{error}</p>}

      <label className="block mb-4">
        Empresa:
        <select
          className="w-full p-3 border rounded mt-2"
          value={empleado.empresa_id}
          onChange={(e) =>
            setEmpleado({ ...empleado, empresa_id: e.target.value })
          }
        >
          {empresas.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
      </label>

      <input
        className="w-full p-3 border rounded mb-4"
        value={empleado.nombre}
        onChange={(e) =>
          setEmpleado({ ...empleado, nombre: e.target.value })
        }
      />

      <input
        className="w-full p-3 border rounded mb-4"
        value={empleado.email}
        onChange={(e) =>
          setEmpleado({ ...empleado, email: e.target.value })
        }
      />

      <input
        className="w-full p-3 border rounded mb-4"
        placeholder="Nueva contraseña (opcional)"
        onChange={(e) =>
          setEmpleado({ ...empleado, password_hash: e.target.value })
        }
      />

      <select
        className="w-full p-3 border rounded mb-6"
        value={empleado.estado}
        onChange={(e) =>
          setEmpleado({ ...empleado, estado: e.target.value })
        }
      >
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
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
