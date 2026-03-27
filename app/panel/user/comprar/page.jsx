"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

export default function ComprarPage({ params }) {
    const router = useRouter();
    const { plugin_id } = params;

    const [plugin, setPlugin] = useState(null);
    const [user, setUser] = useState(null);
    const [emails, setEmails] = useState([""]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 🔥 IMPORTANTE: useRef SIEMPRE DENTRO DEL COMPONENTE
    const paymentUID = useRef(uuidv4()); // se genera solo UNA VEZ

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
        setEmails((prev) =>
            prev.map((e, idx) => (idx === i ? valor : e))
        );
    }

    function añadirFila() {
        setEmails((prev) => [...prev, ""]);
    }

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
                    payment_uid: paymentUID.current
                }),
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

            router.push(`/pago/licencias/${data.pago_id}`);
        } catch (err) {
            console.error(err);
            setError("Error interno del servidor");
        }
    }

    if (loading) return <p>Cargando…</p>;
    if (!plugin) return <p>Plugin no encontrado.</p>;

    const total = plugin.precio * emails.length;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Comprar licencias</h2>

            <p><strong>Plugin:</strong> {plugin.nombre}</p>
            <p><strong>Precio por licencia:</strong> {plugin.precio} €</p>

            <h3 className="text-xl font-semibold">Emails Tekla para activar:</h3>

            {emails.map((email, i) => (
                <div key={i} className="mb-3">
                    <label>Email Tekla #{i + 1}</label>
                    <input
                        value={email}
                        onChange={(e) => actualizarEmail(i, e.target.value)}
                        placeholder="email@empresa.com"
                        className="border p-2 rounded w-full dark:bg-gray-900"
                    />
                </div>
            ))}

            <button
                onClick={añadirFila}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded"
            >
                Añadir otro email
            </button>

            <p className="text-lg font-semibold mt-4">
                Total: {total} €
            </p>

            {error && (
                <p className="text-red-600 font-semibold">{error}</p>
            )}

            <button
                onClick={comprar}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
                Comprar
            </button>
        </div>
    );
}