"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Ticket, Eye } from "lucide-react";

export default function AdminLicenciasPage() {
    const [licencias, setLicencias] = useState([]);

    useEffect(() => {
        async function load() {
            const r = await fetch("/api/admin/licencias", { credentials: "include" });
            const d = await r.json();
            setLicencias(d.licencias ?? []);
        }
        load();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <Ticket size={28} /> Licencias
            </h1>

            <div className="overflow-x-auto shadow rounded">
                <table className="min-w-full border border-gray-300 dark:border-gray-700">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700 text-left">
                            <th className="p-2">Email</th>
                            <th className="p-2">Plugin</th>
                            <th className="p-2">Tipo</th>
                            <th className="p-2">Estado</th>
                            <th className="p-2">Activaciones</th>
                            <th className="p-2">Expira</th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {licencias.map((l) => (
                            <tr key={l.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="p-2">{l.email_tekla}</td>
                                <td className="p-2">{l.plugins?.nombre ?? l.plugin_id}</td>
                                <td className="p-2">{l.tipo}</td>
                                <td className="p-2">{l.estado}</td>
                                <td className="p-2">{l.activaciones_usadas}/{l.max_activaciones}</td>
                                <td className="p-2">
                                  {l.fecha_expiracion
                                    ? new Date(l.fecha_expiracion).toLocaleDateString()
                                    : "—"}
                                </td>
                                <td className="p-2">
                                    <Link 
                                      href={`/panel/admin/licencias/${l.id}`}
                                      className="text-blue-600 flex items-center gap-1">
                                        <Eye size={16} /> Ver
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}