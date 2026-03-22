"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PagoClient({ id, plugin, tipos }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [filas, setFilas] = useState([
    { tipo_id: tipos[0]?.id || null, cantidad: 1 }
  ]);

  const añadirFila = () => {
    setFilas([...filas, { tipo_id: tipos[0]?.id || null, cantidad: 1 }]);
  };

  const eliminarFila = (index) => {
    setFilas(filas.filter((_, i) => i !== index));
  };

  const actualizarFila = (index, campo, valor) => {
    const nuevas = [...filas];
    nuevas[index][campo] = valor;
    setFilas(nuevas);
  };

  const enviar = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/pagos/crear", {
      method: "POST",
      credentials: "include", // ← NECESARIO PARA ENVIAR LA COOKIE
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plugin_id: id,
        email,
        licencias: filas
      })
    });

    if (res.status === 401) {
      alert("Debes iniciar sesión.");
      router.push("/login");
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      alert("Error al crear el pago: " + data.error);
      return;
    }

    const data = await res.json();

    // REDIRECCIÓN CORRECTA
    router.push(`/pago/licencias/${data.pago_id}`);
  };

  return (
    <form onSubmit={enviar} className="space-y-6">

      {/* EMAIL */}
      <div>
        <label className="block font-semibold mb-1">
          Email de Tekla
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          placeholder="cliente@tekla.com"
        />
      </div>

      {/* TABLA DE LICENCIAS */}
      <div>
        <label className="block font-semibold mb-2">
          Licencias a comprar
        </label>

        <div className="space-y-3">
          {filas.map((fila, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border p-3 rounded"
            >
              <select
                value={fila.tipo_id}
                onChange={(e) =>
                  actualizarFila(index, "tipo_id", e.target.value)
                }
                className="border px-2 py-1 rounded"
              >
                {tipos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={fila.cantidad}
                onChange={(e) =>
                  actualizarFila(index, "cantidad", Number(e.target.value))
                }
                className="border px-2 py-1 rounded w-20"
              />

              <button
                type="button"
                onClick={() => eliminarFila(index)}
                className="text-red-600 font-bold"
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={añadirFila}
          className="mt-3 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Añadir fila
        </button>
      </div>

      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        Crear pago
      </button>
    </form>
  );
}
