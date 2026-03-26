"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page({ params }) {
  const { plugin_id } = use(params);
  const router = useRouter();

  const [plugin, setPlugin] = useState(null);
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([""]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const rUser = await fetch("/api/auth/me");
        const dUser = await rUser.json();
        setUser(dUser.user ?? null);

        const rPlugin = await fetch(`/api/plugin/${plugin_id}`);
        const dPlugin = await rPlugin.json();
        setPlugin(dPlugin?.error ? null : dPlugin);
      } catch {
        setError("Error cargando datos");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [plugin_id]);

  function actualizarEmail(i, valor) {
    setEmails(prev =>
      prev.map((e, idx) => (idx === i ? valor : e))
    );
  }

  function añadirFila() {
    setEmails(prev => [...prev, ""]);
  }

  async function crearPago() {
    if (!user) {
      router.push("/login");
      return;
    }

    // VALIDACIÓN FUERTE
    const emailsLimpios = emails.map(e => e.trim());

    if (emailsLimpios.some(e => e === "")) {
      setError("Debes completar TODOS los emails Tekla.");
      return;
    }

    try {
      const res = await fetch("/api/pagos/crear", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plugin_id,
          emails_tekla: emailsLimpios,  // ✔ SOLO emails válidos
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data?.error?.message ??
          data?.error ??
          "Error creando el pago"
        );
        return;
      }

      router.push(`/pago/licencias/${data.pago.id}`);

    } catch (err) {
      console.error(err);
      setError("Error interno del servidor");
    }
  }

  if (loading) return <p className="p-6">Cargando...</p>;
  if (!plugin) return <p className="p-6">Plugin no encontrado.</p>;

  const total = plugin.precio * emails.length;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Comprar licencias</h1>

      <p className="text-lg">
        Plugin: <strong>{plugin.nombre}</strong>
      </p>

      <p>
        Precio por licencia: <strong>{plugin.precio} €</strong>
      </p>

      <div className="space-y-3 mt-6">
        <h3 className="font-semibold text-lg">Emails Tekla para activar:</h3>

        {emails.map((email, i) => (
          <div key={i}>
            <label>Email Tekla #{i + 1}</label>
            <input
              className="w-full p-2 rounded border dark:bg-gray-900"
              value={email}
              onChange={(e) => actualizarEmail(i, e.target.value)}
              placeholder="email@empresa.com"
            />
          </div>
        ))}

        <button
          onClick={añadirFila}
          className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded"
        >
          Añadir fila
        </button>
      </div>

      <p className="text-xl font-bold mt-4">
        Total: {total} €
      </p>

      {error && <p className="text-red-600">{error}</p>}

      <button
        onClick={crearPago}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 mt-4"
      >
        Comprar
      </button>
    </div>
  );
}