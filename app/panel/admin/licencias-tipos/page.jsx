"use client";

import { useEffect, useState } from "react";

export default function TiposLicenciaPage() {
  const [tipos, setTipos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  async function cargar() {
    const res = await fetch("/api/admin/licencias-tipos");
    const data = await res.json();
    setTipos(data.tipos || []);
  }

  async function crear() {
    const res = await fetch("/api/admin/licencias-tipos/crear", {
      method: "POST",
      body: JSON.stringify({ nombre, descripcion }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    setNombre("");
    setDescripcion("");
    cargar();
  }

  async function borrar(id) {
    if (!confirm("¿Eliminar este tipo?")) return;

    const res = await fetch("/api/admin/licencias-tipos/borrar", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    cargar();
  }

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tipos de licencia</h2>

      <div className="mb-6">
        <input
          className="border p-2 mr-2"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          className="border p-2 mr-2"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={crear}
        >
          Crear
        </button>
      </div>

      <table className="w-full bg-gray-100 shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Nombre</th>
            <th className="p-2">Descripción</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {tipos.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="p-2">{t.nombre}</td>
              <td className="p-2">{t.descripcion}</td>
              <td className="p-2">
                <button className="text-red-600" onClick={() => borrar(t.id)}>
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
