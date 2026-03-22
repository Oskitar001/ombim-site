"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PagoPage({ params }) {
  const { plugin_id } = params;
  const router = useRouter();

  const [filas, setFilas] = useState([{ email_tekla: "" }]);
  const [error, setError] = useState("");

  const addFila = () => {
    setFilas([...filas, { email_tekla: "" }]);
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

  return (
    <div className="max-w-2xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-4">Comprar licencias</h1>

      <form onSubmit={submit} className="space-y-4">
        {filas.map((f, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="email"
              placeholder="Email Tekla"
              value={f.email_tekla}
              onChange={(e) => updateFila(i, e.target.value)}
              required
              className="border p-2 flex-1 rounded"
            />
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
