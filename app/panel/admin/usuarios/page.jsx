"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Pencil, Trash2, Eye } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function AdminUsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [me, setMe] = useState(null);

    // Obtener lista de usuarios
    useEffect(() => {
        async function load() {
            const r = await fetch("/api/admin/usuarios", { credentials: "include" });
            const d = await r.json();
            setUsuarios(d.users ?? []);
        }
        load();
    }, []);

    // Obtener datos del admin actual
    useEffect(() => {
        fetch("/api/auth/me", { credentials: "include" })
            .then((r) => r.json())
            .then((d) => setMe(d.user ?? null));
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Usuarios</h2>

            <table className="w-full border border-gray-300 dark:border-gray-700">
                <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                        <th className="p-2">Email</th>
                        <th className="p-2">Rol</th>
                        <th className="p-2">Último login</th>
                        <th className="p-2">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {usuarios.map((u) => (
                        <tr key={u.id} className="border-b dark:border-gray-700">
                            <td className="p-2">{u.email}</td>

                            <td className="p-2">{u.user_metadata?.role ?? "user"}</td>

                            <td className="p-2">
                                {u.last_sign_in_at
                                    ? new Date(u.last_sign_in_at).toLocaleString()
                                    : "—"}
                            </td>

                            <td className="flex gap-4 p-2">

                                <Link href={`/panel/admin/usuarios/${u.id}`}>
                                    <Eye className="text-blue-500 hover:text-blue-700" />
                                </Link>

                                {me && me.id !== u.id && (
                                    <>
                                        <button
                                            onClick={async () => {
                                                await fetch("/api/admin/usuarios/editar", {
                                                    method: "POST",
                                                    credentials: "include",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({
                                                        id: u.id,
                                                        role:
                                                            u.user_metadata?.role === "admin"
                                                                ? "user"
                                                                : "admin",
                                                    }),
                                                });
                                                location.reload();
                                            }}
                                        >
                                            <Pencil className="text-yellow-500 hover:text-yellow-600" />
                                        </button>

                                        <button
                                            onClick={() => {
                                                setSelectedUser(u.id);
                                                setOpen(true);
                                            }}
                                        >
                                            <Trash2 className="text-red-600 hover:text-red-800" />
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}

                    {usuarios.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-4 text-center opacity-70">
                                No hay usuarios.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <ConfirmDialog
                open={open}
                onCancel={() => setOpen(false)}
                onConfirm={async () => {
                    await fetch("/api/admin/usuarios/borrar", {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: selectedUser }),
                    });
                    setOpen(false);
                    location.reload();
                }}
            />
        </div>
    );
}