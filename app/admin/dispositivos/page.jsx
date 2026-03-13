"use client";
import { useEffect, useState } from "react";

export default function DispositivosPage() {
  const [dispositivos, setDispositivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioId, setUsuarioId] = useState(null);

  // Obtener usuarioId desde la URL (solo en cliente)
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("usuario");
    setUsuarioId(id);
  }, []);

  async function cargar() {
    if (!usuarioId) return; // evitar cargar antes de tener el ID

    const res = await fetch(
      `/api/admin/devices?usuario=${usuarioId}&q=${busqueda}`
    );
    const data = await res.json();
    setDispositivos(data.dispositivos || []);
    setLoading(false);
  }

  async function eliminar(id) {
    if (!confirm("¿Eliminar este dispositivo?")) return;

    await fetch("/api/admin/devices/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    cargar();
  }

  useEffect(() => {
    cargar();
  }, [busqueda, usuarioId]);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Dispositivos</h1>

      <input
        type="text"
        placeholder="Buscar hardware ID..."
        className="mb-6 w-full max-w-md p-3 rounded bg-neutral-800 text-white"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {loading ? (
        <p className="text-neutral-400">Cargando...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-neutral-800">
              <th className="p-3">ID</th>
              <th className="p-3">Hardware ID</th>
              <th className="p-3">Última conexión</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {dispositivos.map((d) => (
              <tr key={d.id} className="border-b border-neutral-900">
                <td className="p-3">{d.id}</td>
                <td className="p-3">{d.hardware_id}</td>
                <td className="p-3">{d.ultima_conexion}</td>
                <td className="p-3">
                  <button
                    onClick={() => eliminar(d.id)}
                    className="text-red-400 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
