"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { ShoppingCart, Mail, Euro } from "lucide-react";

/* -----------------------------------------
   COMPONENTES PREMIUM REUTILIZABLES
------------------------------------------ */

function UserSection({ title, children }) {
  return (
    <section
      className="
        bg-white dark:bg-gray-900 
        border border-gray-300 dark:border-gray-700
        rounded-xl shadow p-6 space-y-4
      "
    >
      {title && (
        <h3 className="text-xl font-bold border-b border-gray-300 dark:border-gray-700 pb-2">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="font-semibold">{label}</label>
      {children}
    </div>
  );
}

function InputPremium({ ...props }) {
  return (
    <input
      {...props}
      className="
        w-full px-3 py-2 rounded-lg
        bg-gray-100 dark:bg-gray-800
        border border-gray-300 dark:border-gray-700
        focus:ring-2 focus:ring-blue-600
        transition
      "
    />
  );
}

function ButtonPremium({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`
        w-full py-3 rounded-lg text-white font-semibold 
        shadow transition ${className}
      `}
    >
      {children}
    </button>
  );
}

/* -----------------------------------------
   PÁGINA PRINCIPAL
------------------------------------------ */

export default function ComprarPage({ params }) {
  const router = useRouter();
  const { plugin_id } = params;

  const [plugin, setPlugin] = useState(null);
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([""]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tipo, setTipo] = useState("completa"); // ⭐ tipo de licencia
  const paymentUID = useRef(uuidv4());

  /* ==========================================
        CARGA INICIAL
  ========================================== */
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
    setEmails((prev) => prev.map((e, idx) => (idx === i ? valor : e)));
  }

  function añadirFila() {
    setEmails((prev) => [...prev, ""]);
  }

  /* ==========================================
        ACCIÓN: COMPRAR
  ========================================== */
  async function comprar(e) {
    e.preventDefault();
    setError("");

    if (!user) {
      router.push("/login");
      return;
    }

    const emailsLimpios = emails.map((e) => e.trim());

    if (emailsLimpios.some((e) => e === "")) {
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
          emails_tekla: emailsLimpios,
          payment_uid: paymentUID.current,
          tipo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Error creando el pago");
        return;
      }

      router.push(`/pago/licencias/${data.pago_id}`);
    } catch {
      setError("Error interno del servidor");
    }
  }

  if (loading) return <p className="p-4">Cargando…</p>;
  if (!plugin) return <p className="p-4">Plugin no encontrado.</p>;

  /* ==========================================
        CÁLCULO DE PRICING
  ========================================== */

  const precioCompleta =
    plugin.precio_completa > 0 ? plugin.precio_completa : plugin.precio;

  const precioAnual = plugin.precio_anual > 0 ? plugin.precio_anual : 0;

  const precioUnitario = tipo === "anual" ? precioAnual : precioCompleta;
  const total = precioUnitario * emails.length;

  /* ==========================================
        UI PREMIUM
  ========================================== */

  return (
    <div className="p-4 max-w-xl mx-auto space-y-8">

      <h2 className="text-3xl font-bold flex items-center gap-2">
        <ShoppingCart size={30} /> Comprar licencias
      </h2>

      <UserSection>
        <p className="text-lg">
          Plugin: <strong>{plugin.nombre}</strong>
        </p>
      </UserSection>

      {/* Tipo de licencia */}
      <UserSection title="Tipo de licencia">
        <Field label="Selecciona tipo:">
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="
              w-full px-3 py-2 rounded-lg 
              bg-gray-100 dark:bg-gray-800
              border border-gray-300 dark:border-gray-700
              focus:ring-2 focus:ring-blue-600
            "
          >
            {precioAnual > 0 && (
              <option value="anual">Anual – {precioAnual} €</option>
            )}
            {precioCompleta > 0 && (
              <option value="completa">Completa – {precioCompleta} €</option>
            )}
          </select>
        </Field>
      </UserSection>

      {/* Emails Tekla */}
      <UserSection title="Emails Tekla">
        {emails.map((email, i) => (
          <InputPremium
            key={i}
            type="email"
            value={email}
            placeholder="usuario@empresa.com"
            onChange={(e) => actualizarEmail(i, e.target.value)}
            className="mb-2"
          />
        ))}

        <button
          onClick={añadirFila}
          className="text-blue-600 underline"
        >
          Añadir otro email
        </button>
      </UserSection>

      {/* Total */}
      <UserSection title="Resumen del pago">
        <p className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <Euro size={20} /> Total: {total} €
        </p>

        {error && <p className="text-red-600">{error}</p>}
      </UserSection>

      {/* Botón comprar */}
      <ButtonPremium
        onClick={comprar}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Comprar
      </ButtonPremium>
    </div>
  );
}