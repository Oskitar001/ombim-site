"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, CheckCircle, Eye } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

/* Tooltip PRO */
function Tooltip({ label, children }) {
  return (
    <span className="relative group">
      {children}
      <span className="absolute hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        {label}
      </span>
    </span>
  );
}

export default function AdminPagosPage() {
  const [pagos, setPagos] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const r = await fetch("/api/admin/pagos", {
        credentials: "include",
      });

      const d = await r.json();
      setPagos(d ?? []);
    } catch (err) {
      console.error("Error cargando pagos:", err);
      setPagos([]);
    }
  }

  function confirmarValidacion(pago) {
    setSelectedPago(pago);
    setOpen(true);
  }

  async function validar() {
    await fetch(`/api/admin/pagos/validar/${selectedPago.id}`, {
      method: "POST",
      credentials: "include",
    });

    setOpen(false);
    load();
  }

  return (
    <div>
      {/* Título */}
      <h2 className="text-2xl font-bold mb-4">Pagos</h2>

      {/* Tabla */}
      <table className="w-full">
        <tr>
          <th>ID</th>
          <th>Usuario</th>
          <th>Plugin</th>
          <th>Licencias</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>

        {pagos.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.user_email}</td>
            <td>{p.plugin_id}</td>
            <td>{p.cantidad_licencias}</td>

            {/* Estado */}
            <td>
              {p.estado === "pendiente" && (
                <span className="text-yellow-500">Pendiente</span>
              )}
              {p.estado === "validado" && (
                <span className="text-green-600">Validado</span>
              )}
            </td>

            {/* Fecha */}
            <td>{new Date(p.fecha).toLocaleString()}</td>

            {/* Acciones */}
            <td className="flex gap-4">
              {/* Ver */}
              <Link href={`/panel/admin/pagos/${p.id}`}>
                <Eye className="text-blue-500 hover:text-blue-700" />
              </Link>

              {/* Validar */}
              {p.estado !== "validado" && (
                <button
                  onClick={() => confirmarValidacion(p)}
                  className="text-green-600 hover:text-green-800"
                >
                  <CheckCircle />
                </button>
              )}
            </td>
          </tr>
        ))}
      </table>

      {/* Confirmación */}
      <ConfirmDialog
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={validar}
      />
    </div>
  );
}