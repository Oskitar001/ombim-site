"use client";

import { useState } from "react";

export default function LicenciaAcciones({ id, onUpdated }) {
    const [loading, setLoading] = useState(false);

    async function call(endpoint) {
        setLoading(true);
        const res = await fetch(`/api/admin/licencias/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        setLoading(false);
        if (!res.ok) {
            alert("Error ejecutando acción");
            return;
        }
        onUpdated();
    }

    return (
        <div className="flex flex-col gap-3 max-w-sm">

            <button onClick={() => call("activar")} disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded">
                Activar
            </button>

            <button onClick={() => call("bloquear")} disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded">
                Bloquear
            </button>

            <button onClick={() => call("reset-activaciones")} disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded">
                Reset activaciones
            </button>

            {/* NUEVOS BOTONES */}
            <button onClick={() => call("hacer-anual")} disabled={loading}
                className="bg-yellow-600 text-white px-4 py-2 rounded">
                Hacer anual
            </button>

            <button onClick={() => call("hacer-completa")} disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded">
                Hacer completa
            </button>

        </div>
    );
}