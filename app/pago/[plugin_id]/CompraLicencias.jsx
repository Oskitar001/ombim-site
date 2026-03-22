"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompraLicencias({ plugin, plugin_id }) {
  const router = useRouter();

  const [filas, setFilas] = useState([{ email_tekla: "" }]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addFila = () => setFilas([...filas, { email_tekla: "" }]);

  const removeFila = (index) => {
    if (filas.length === 1) return;
    setFilas(filas.filter((_, i) => i !== index));
  };

  const updateFila = (i, value) => {
    const copy = [...filas];
    copy[i].email_tekla = value;
    setFilas(copy);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!plugin || !plugin.precio) {
      setError("Datos incompletos");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/pagos/crear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        plugin_id,
        licencias: filas,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Error al crear el pago");
      return;
    }

    router.push(`/pago/licencias/${data.pago_id}`);
  };

  const cantidad = filas.length;
  const precioUnitario = plugin?.precio || 0;
  const total = cantidad * precioUnitario;

  return (
    <div className="max-w-2xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-4">Comprar licencias</h1>

      {/* ⭐ INFORMACIÓN DEL PLUGIN */}
      <div className="mb-6 space-y-3">
        <h2 className="text-xl font-semibold">{plugin.nombre}</h2>
        <p className="text-gray-600">{plugin.descripcion}</p>

        <p className="text-sm text-gray-500">
          Precio por licencia: <strong>{precioUnitario.toFixed(2)} €</strong>
        </p>
      </div>

      {/* ⭐ FORMULARIO */}
      <form onSubmit={submit} className="space-y-4">
        {filas.map((f, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="email"
              placeholder={`Email Tekla licencia ${i + 1}`}
              value={f.email_tekla}
              onChange={(e) => updateFila(i, e.target.value)}
              required
              className="border p-2 flex-1 rounded"
            />

            {filas.length > 1 && (
              <button
                type="button"
                onClick={() => removeFila(i)}
                className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Eliminar
              </button>
            )}
          </div>
        ))}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addFila}
            className="px-3 py-2 border rounded text-sm"
          >
            Añadir otra licencia
          </button>

          <span className="text-sm text-gray-500">
            Total: {cantidad} licencia{cantidad !== 1 ? "s" : ""} ·{" "}
            <strong>{total.toFixed(2)} €</strong>
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="block bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Creando pago..." : "Continuar"}
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
}
