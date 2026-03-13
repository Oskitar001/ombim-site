"use client";

import { useEffect, useState } from "react";

export default function UsuarioDetalle({ params }) {
  const { id } = params;
  const [usuario, setUsuario] = useState(null);

  async function cargar() {
    const res = await fetch(`/api/admin/usuario/${id}`);
    const data = await res.json();
    setUsuario(data);
  }

  async function accion(tipo) {
    await fetch(`/api/admin/usuario/${id}/${tipo}`, {
      method: "POST",
    });

    cargar(); // refrescar datos
  }

  useEffect(() => {
    cargar();
  }, []);

  if (!usuario) return <p className="p-10">Cargando...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Usuario: {usuario.email}</h1>

      {/* Botón editar */}
      <div className="mb-4">
        <a
          href={`/admin/usuario/${id}/editar`}
          className="bg-purple-600 text-black px-4 py-2 rounded hover:bg-purple-700"
        >
          Editar usuario
        </a>
      </div>

      <p><strong>Estado:</strong> {usuario.estado}</p>
      <p><strong>Expira:</strong> {usuario.fecha_expiracion}</p>
      <p><strong>Máx. dispositivos:</strong> {usuario.max_dispositivos}</p>
      <p><strong>Usados:</strong> {usuario.dispositivos.length}</p>

      {/* Acciones */}
      <div className="mt-6 flex gap-4 flex-wrap">

        <button
          onClick={() => accion("suspender")}
          className="bg-red-600 text-black px-4 py-2 rounded hover:bg-red-700"
        >
          Suspender usuario
        </button>

        <button
          onClick={() => accion("activar")}
          className="bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700"
        >
          Activar usuario
        </button>

        <button
          onClick={() => accion("extender")}
          className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700"
        >
          Extender licencia +30 días
        </button>

        <button
          onClick={() => accion("reset-hwid")}
          className="bg-yellow-600 text-black px-4 py-2 rounded hover:bg-yellow-700"
        >
          Resetear HWID
        </button>

      </div>

      {/* Dispositivos */}
      <h2 className="text-xl font-bold mt-8 mb-2">Dispositivos</h2>

      {usuario.dispositivos.length === 0 ? (
        <p>No hay dispositivos registrados.</p>
      ) : (
        <ul className="list-disc ml-6">
          {usuario.dispositivos.map((d) => (
            <li key={d.id}>
              {d.hardware_id} — {new Date(d.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
