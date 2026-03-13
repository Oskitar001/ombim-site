"use client";

import { useEffect, useState } from "react";

export default function EditarUsuario({ params }) {
  const { id } = params;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [estado, setEstado] = useState("activo");
  const [expira, setExpira] = useState("");
  const [maxDisp, setMaxDisp] = useState(3);
  const [mensaje, setMensaje] = useState("");

  async function cargar() {
    const res = await fetch(`/api/admin/usuario/${id}`);
    const data = await res.json();

    setEmail(data.email);
    setEstado(data.estado);
    setExpira(data.fecha_expiracion.split("T")[0]);
    setMaxDisp(data.max_dispositivos);
  }

  async function guardar(e) {
    e.preventDefault();

    const res = await fetch(`/api/admin/usuario/${id}/editar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        estado,
        expira,
        maxDisp,
      }),
    });

    const data = await res.json();
    setMensaje(data.msg);
  }

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Editar Usuario</h1>

      <form onSubmit={guardar} className="space-y-4 bg-white p-6 shadow rounded">

        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Nueva contraseña (opcional)</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Dejar vacío para no cambiar"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Estado</label>
          <select
            className="w-full border p-2 rounded"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="activo">Activo</option>
            <option value="suspendido">Suspendido</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Fecha de expiración</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={expira}
            onChange={(e) => setExpira(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Máx. dispositivos</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={maxDisp}
            onChange={(e) => setMaxDisp(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar cambios
        </button>
      </form>

      {mensaje && (
        <p className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          {mensaje}
        </p>
      )}
    </div>
  );
}
