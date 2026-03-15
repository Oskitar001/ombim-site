"use client";

import { useState, useEffect } from "react";

export default function NuevoEmpleadoPage() {
  const [empresas, setEmpresas] = useState([]);
  const [empresaId, setEmpresaId] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [estado, setEstado] = useState("activo");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/empresas")
      .then((res) => res.json())
      .then((data) => setEmpresas(data));
  }, []);

  async function crear() {
    setError("");

    const res = await fetch("/api/admin/empleados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        empresa_id: empresaId,
        nombre,
        email,
        password_hash: password,
        estado,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }

    window.location.href = "/admin/empleados";
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Nuevo empleado</h1>

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

      <input
        className="w-full p-3 border rounded mb-4"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        className="w-full p-3 border rounded mb-4"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full p-3 border rounded mb-4"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select
        className="w-full p-3 border rounded mb-6"
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
      >
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>

      <button
        onClick={crear}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Crear empleado
      </button>
    </div>
  );
}
