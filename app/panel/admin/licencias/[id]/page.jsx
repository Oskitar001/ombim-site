"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    KeyRound,
    CheckCircle,
    Ban,
    RefreshCw,
    Calendar,
    Star
} from "lucide-react";

export default function AdminLicenciaDetallePage({ params }) {
    // Next.js 16 fix (params es Promise)
    const { id } = use(params);

    const [licencia, setLicencia] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        async function load() {
            const r = await fetch(`/api/admin/licencias/${id}`, {
                credentials: "include",
            });
            const d = await r.json();
            setLicencia(d.licencia ?? null);
            setLoading(false);
        }
        load();
    }, [id]);

    if (!id) return <p>ID inválido</p>;
    if (loading) return <p>Cargando licencia…</p>;
    if (!licencia) return <p>Licencia no encontrada</p>;

    async function accion(endpoint) {
        await fetch(`/api/admin/licencias/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: licencia.id }),
        });
        location.reload();
    }

    return (
        <div className="space-y-6 p-4">
            <Link
                href="/panel/admin/licencias"
                className="text-blue-600 hover:underline flex items-center gap-1"
            >
                <ArrowLeft size={20} /> Volver
            </Link>

            <h1 className="text-3xl font-bold flex items-center gap-2">
                <KeyRound size={28} /> Licencia #{licencia.id}
            </h1>

            {/* DATOS DE LA LICENCIA */}
            <div className="p-6 rounded-lg bg-gray-200 dark:bg-gray-800 shadow space-y-3">
                <p>
                    <strong>Plugin:</strong> {licencia.plugins?.nombre ?? licencia.plugin_id}
                </p>

                <p>
                    <strong>Email Tekla:</strong> {licencia.email_tekla}
                </p>

                <p>
                    <strong>Tipo:</strong>{" "}
                    {licencia.tipo === "anual" && (
                        <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs font-semibold inline-flex items-center gap-1">
                            <Calendar size={14} /> Anual
                        </span>
                    )}
                    {licencia.tipo === "completa" && (
                        <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-xs font-semibold inline-flex items-center gap-1">
                            <Star size={14} /> Completa
                        </span>
                    )}
                    {licencia.tipo === "trial" && (
                        <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-semibold inline-flex items-center gap-1">
                            Trial
                        </span>
                    )}
                </p>

                <p>
                    <strong>Estado:</strong>{" "}
                    {licencia.estado === "activa" && (
                        <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-semibold inline-flex items-center gap-1">
                            <CheckCircle size={14} /> Activa
                        </span>
                    )}
                    {licencia.estado === "bloqueada" && (
                        <span className="px-2 py-1 bg-red-200 text-red-800 rounded text-xs font-semibold inline-flex items-center gap-1">
                            <Ban size={14} /> Bloqueada
                        </span>
                    )}
                    {licencia.estado === "trial" && (
                        <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-semibold inline-flex items-center gap-1">
                            Trial
                        </span>
                    )}
                    {licencia.estado === "expirada" && (
                        <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded text-xs font-semibold inline-flex items-center gap-1">
                            Expirada
                        </span>
                    )}
                </p>

                <p>
                    <strong>Activaciones:</strong>{" "}
                    {licencia.activaciones_usadas}/{licencia.max_activaciones}
                </p>

                {/* NUEVO: Expiración solo para anual */}
                <p>
                    <strong>Expira:</strong>{" "}
                    {licencia.fecha_expiracion
                        ? new Date(licencia.fecha_expiracion).toLocaleString()
                        : "—"}
                </p>

                <p>
                    <strong>Creada:</strong>{" "}
                    {new Date(licencia.fecha_creacion).toLocaleString()}
                </p>
            </div>

            {/* ACCIONES */}
            <div className="flex flex-col gap-3 max-w-sm">
                <button
                    onClick={() => accion("activar")}
                    className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <CheckCircle size={18} /> Activar
                </button>

                <button
                    onClick={() => accion("bloquear")}
                    className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <Ban size={18} /> Bloquear
                </button>

                <button
                    onClick={() => accion("reset-activaciones")}
                    className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <RefreshCw size={18} /> Reset activaciones
                </button>

                {/* NUEVOS BOTONES */}
                <button
                    onClick={() => accion("hacer-anual")}
                    className="bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <Calendar size={18} /> Hacer anual
                </button>

                <button
                    onClick={() => accion("hacer-completa")}
                    className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <Star size={18} /> Hacer completa
                </button>
            </div>
        </div>
    );
}
