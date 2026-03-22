"use client";

import { useEffect, useState } from "react";

export default function AdminLicenciaDetallePage({ params }) {
  const { id } = params;

  const [licencia, setLicencia] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargar = () => {
    fetch(`/api/licencias/todas?id=${id}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setLicencia(data.licencia);
      });
  };

  useEffect(() => {
    cargar();
  }, [id]);

  const accion = async (endpoint) => {
    setError("");
    setMensaje("");

    const res = await fetch(`/api/licencias/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ licencia_id: id }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Error en la acción");
      return;
    }

    setMensaje("Acción realizada correctamente.");
    cargar();
  };

  if (!licencia && !error) {
    return <div className="pt-32 px-6">Cargando...</div>;
  }

  if (error) {
    return <div className="pt-32 px-6 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-4">Licencia {licencia.id}</h1>

      <p>
        <strong>Plugin:</strong> {licencia.plugin_id}
      </p>
      <p>
        <strong>Email Tekla:</strong> {licencia.email_tekla}
      </p>
      <p>
        <strong>Estado:</strong> {licencia.estado}
      </p>
      <p>
        <strong>Activaciones usadas:</strong> {licencia.activaciones_usadas} /{" "}
        {licencia.max_activaciones}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => accion("activar")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Activar
        </button>
        <button
          onClick={() => accion("trial")}
          className="bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Poner en trial
        </button>
        <button
          onClick={() => accion("bloquear")}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Bloquear
        </button>
        <button
          onClick={() => accion("reset-activaciones")}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Reset activaciones
        </button>
      </div>

      {mensaje && <p className="mt-4 text-green-600">{mensaje}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
