"use client";

import { useState, useEffect } from "react";

export default function NuevoDispositivoPage() {
  const [empresas, setEmpresas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [empresaId, setEmpresaId] = useState("");
  const [empleadoId, setEmpleadoId] = useState("");
  const [uuid, setUuid] = useState("");
  const [estado, setEstado] = useState("activo");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/empresas")
      .then((res) => res.json())
      .then((data) => setEmpresas(data));
  }, []);

  useEffect(() => {
    if (!empresaId) return;
    fetch(`/api/admin/empleados?empresa_id=${empresaId}`)
      .then((res) => res.json())
      .then((data) => setEmpleados(data));
  }, [empresaId]);

  async function crear() {
    setError("");

    const res = await fetch("/api/admin/dispositivos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        empresa_id: empresaId,
        empleado_id: empleadoId,
        uuid,
        estado,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }

    window.location.href = "/admin/dispositivos";
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Nuevo dispositivo</h1>

      {error && <p className="bg-red-100 text-red-700 p-3 mb-4">{error}</p>}

      <label className="block mb-4">
        Empresa:
        <select
          className="w-full p-3 border rounded mt-2"
          value={empresaId}
          onChange={(e) => setEmpresaId(e.target.value)}
        >
          <option value="">Selecciona una empresa</option>
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
          value={empleadoId}
          onChange={(e) => setEmpleadoId(e.target.value)}
        >
          <option value="">Selecciona un empleado</option>
          {empleados.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
      </label>

      <input
        className="w-full p-3 border rounded mb-4"
        placeholder="UUID del dispositivo"
        value={uuid}
        onChange={(e) => setUuid(e.target.value)}
      />

      <select
        className="w-full p-3 border rounded mb-6"
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
      >
        <option value="activo">Activo</option>
        <option value="bloqueado">Bloqueado</option>
      </select>

      <button
        onClick={crear}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Crear dispositivo
      </button>
    </div>
  );
}
