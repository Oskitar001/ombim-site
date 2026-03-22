"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PagoPage(props) {
  const { plugin_id } = props.params;
  const router = useRouter();

  const [filas, setFilas] = useState([{ email_tekla: "" }]);
  const [error, setError] = useState("");

  const addFila = () => {
    setFilas([...filas, { email_tekla: "" }]);
  };

  const removeFila = (index) => {
    if (filas.length === 1) return; // siempre al menos 1
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

    if (!res.ok) {
      setError(data.error || "Error al crear el pago");
      return;
    }

    router.push(`/pago/licencias/${data.pago_id}`);
  };

  const cantidad = filas.length;

  return (
    <div className="max-w-2xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-4">Comprar licencias</h1>

      <p className="text-gray-600 mb-4">
        Cantidad: <strong>{cantidad} licencia{cantidad !== 1 ? "s" : ""}</strong>
      </p>

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

        <button
          type="button"
          onClick={addFila}
          className="px-3 py-2 border rounded"
        >
          Añadir otra licencia
        </button>

        <button
          type="submit"
          className="block bg-purple-600 text-white px-4 py-2 rounded"
        >
          Continuar
        </button>

        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}
