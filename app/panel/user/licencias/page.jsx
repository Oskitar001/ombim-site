"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { KeyRound, Clock, Star, Calendar, Ban, Eye } from "lucide-react";

export default function UserLicenciasPage() {
    const [licencias, setLicencias] = useState(null);

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/user/licencias", {
                credentials: "include",
            });
            const data = await res.json();
            setLicencias(data.licencias ?? []);
        }
        load();
    }, []);

    if (licencias === null) {
        return <p>Cargando licencias...</p>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Mis licencias</h2>

            {licencias.length === 0 && <p>Todavía no tienes licencias.</p>}

            <table className="min-w-full border border-gray-300 dark:border-gray-700">
                <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                        <th className="p-2">Plugin</th>
                        <th className="p-2">Email Tekla</th>
                        <th className="p-2">Tipo</th>
                        <th className="p-2">Estado</th>
                        <th className="p-2">Activaciones</th>
                        <th className="p-2">Expira</th>
                        <th className="p-2"></th>
                    </tr>
                </thead>

                <tbody>
                    {licencias.map((l) => (
                        <tr key={l.id} className="border-b dark:border-gray-700">
                            <td className="p-2">{l.plugin_nombre ?? l.plugin_id}</td>
                            <td className="p-2">{l.email_tekla}</td>

                            <td className="p-2">
                                {l.tipo === "trial" && (
                                    <span className="px-2 py-1 text-xs bg-blue-200 text-blue-800 rounded flex items-center gap-1 w-fit">
                                        <Clock size={14} /> Trial
                                    </span>
                                )}
                                {l.tipo === "anual" && (
                                    <span className="px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded flex items-center gap-1 w-fit">
                                        <Calendar size={14} /> Anual
                                    </span>
                                )}
                                {l.tipo === "completa" && (
                                    <span className="px-2 py-1 text-xs bg-purple-200 text-purple-800 rounded flex items-center gap-1 w-fit">
                                        <Star size={14} /> Completa
                                    </span>
                                )}
                            </td>

                            <td className="p-2">
                                {l.estado === "activa" && (
                                    <span className="text-green-700 font-semibold">Activa</span>
                                )}
                                {l.estado === "bloqueada" && (
                                    <span className="text-red-700 font-semibold">Bloqueada</span>
                                )}
                                {l.estado === "trial" && (
                                    <span className="text-blue-700 font-semibold">Trial</span>
                                )}
                                {l.estado === "expirada" && (
                                    <span className="text-orange-700 font-semibold">Expirada</span>
                                )}
                            </td>

                            <td className="p-2">
                                {l.activaciones_usadas}/{l.max_activaciones}
                            </td>

                            <td className="p-2">
                                {l.tipo === "anual" && l.fecha_expiracion
                                    ? new Date(l.fecha_expiracion).toLocaleDateString()
                                    : "—"}
                            </td>

                            <td className="p-2">
                                <Link
                                    href={`/panel/user/licencias/${l.id}`}
                                    className="flex items-center gap-1 text-blue-600 hover:underline"
                                >
                                    <Eye size={16} /> Ver
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
