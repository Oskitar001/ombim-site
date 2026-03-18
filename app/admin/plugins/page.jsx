"use client";

import { useEffect, useState } from "react";

export default function PluginsPage() {
  const [plugins, setPlugins] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  async function cargar() {
    const res = await fetch("/api/admin/plugins");
    const data = await res.json();
    setPlugins(data.plugins || []);
  }

  async function crear() {
    const res = await fetch("/api/admin/plugins/crear", {
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
    if (!confirm("¿Eliminar este plugin?")) return;

    const res = await fetch("/api/admin/plugins/borrar", {
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
      <h2 className="text-2xl font-bold mb-4">Plugins</h2>

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

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Nombre</th>
            <th className="p-2">Descripción</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {plugins.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.nombre}</td>
              <td className="p-2">{p.descripcion}</td>
              <td className="p-2">
                <button
                  className="text-red-600"
                  onClick={() => borrar(p.id)}
                >
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
