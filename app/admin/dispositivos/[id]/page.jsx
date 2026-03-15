"use client";

import { useState, useEffect } from "react";

export default function EditarDispositivo({ params }) {
  const id = params.id;

  const [dispositivo, setDispositivo] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/dispositivos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setDispositivo(data);

        fetch(`/api/admin/empleados?empresa_id=${data.empresa_id}`)
          .then((res) => res.json())
          .then((emps) => setEmpleados(emps));
      });

    fetch("/api/admin/empresas")
      .then((res) => res.json())
      .then((data) => setEmpresas(data));
  }, [id]);

  async function guardar() {
    const res = await fetch(`/api/admin/dispositivos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dispositivo),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }

    window.location.href = "/admin/dispositivos";
  }

  async function eliminar() {
    if (!confirm("¿Eliminar dispositivo?")) return;

    await fetch(`/api/admin/dispositivos/${id}`, { method: "DELETE" });

    window.location.href = "/admin/dispositivos";
  }

  if (!dispositivo) return <p>Cargando...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Editar dispositivo</h1>

      {error && <p className="bg-red-100 text-red-700 p-3 mb-4">{error}</p>}

      <label className="block mb-4">
        Empresa:
        <select
          className="w-full p-3 border rounded mt-2"
          value={dispositivo.empresa_id}
          onChange={(e) =>
            setDispositivo({ ...dispositivo, empresa_id: e.target.value })
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
        Empleado:
        <select
          className="w-full p-3 border rounded mt-2"
          value={dispositivo.empleado_id}
          onChange={(e) =>
            setDispositivo({ ...dispositivo, empleado_id: e.target.value })
          }
        >
          {empleados.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
      </label>

      <input
        className="w-full p-3 border rounded mb-4"
        value={dispositivo.uuid}
        onChange={(e) =>
          setDispositivo({ ...dispositivo, uuid: e.target.value })
        }
      />

      <select
        className="w-full p-3 border rounded mb-6"
        value={dispositivo.estado}
        onChange={(e) =>
          setDispositivo({ ...dispositivo, estado: e.target.value })
        }
      >
        <option value="activo">Activo</option>
        <option value="bloqueado">Bloqueado</option>
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
