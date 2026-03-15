"use client";

import { useState, useEffect } from "react";

export default function NuevaLicenciaPage() {
  const [empresas, setEmpresas] = useState([]);
  const [empresaId, setEmpresaId] = useState("");
  const [plugin, setPlugin] = useState("Union2Partes");
  const [cantidad, setCantidad] = useState(1);
  const [expira, setExpira] = useState("");
  const [estado, setEstado] = useState("activa");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/empresas")
      .then((res) => res.json())
      .then((data) => setEmpresas(data));
  }, []);

  async function crear() {
    setError("");

    const res = await fetch("/api/admin/licencias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        empresa_id: empresaId,
        plugin,
        cantidad,
        fecha_expiracion: expira,
        estado,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }

    window.location.href = "/admin/licencias";
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Nueva licencia</h1>

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
        Plugin:
        <select
          className="w-full p-3 border rounded mt-2"
          value={plugin}
          onChange={(e) => setPlugin(e.target.value)}
        >
          <option value="Union2Partes">Union 2 Partes</option>
        </select>
      </label>

      <label className="block mb-4">
        Cantidad:
        <input
          type="number"
          className="w-full p-3 border rounded mt-2"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
      </label>

      <label className="block mb-4">
        Fecha de expiración:
        <input
          type="date"
          className="w-full p-3 border rounded mt-2"
          value={expira}
          onChange={(e) => setExpira(e.target.value)}
        />
      </label>

      <label className="block mb-6">
        Estado:
        <select
          className="w-full p-3 border rounded mt-2"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="activa">Activa</option>
          <option value="suspendida">Suspendida</option>
        </select>
      </label>

      <button
        onClick={crear}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Crear licencia
      </button>
    </div>
  );
}
