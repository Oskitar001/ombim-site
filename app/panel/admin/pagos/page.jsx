import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPagosPage() {
  const auth = await requireAdmin();
  if (!auth.ok) return null;

  const { data: pagos } = await supabaseAdmin
    .from("pagos")
    .select("id, user_id, plugin_id, cantidad_licencias, estado, fecha")
    .order("fecha", { ascending: false });

  return (
    <div className="space-y-6">

      {/* TÍTULO */}
      <h1 className="text-xl font-bold flex items-center gap-2">
        <CreditCard size={24} /> Pagos
      </h1>

      {!pagos?.length && (
        <p>No hay pagos aún.</p>
      )}

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-left">
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Usuario</th>
              <th className="border px-3 py-2">Plugin</th>
              <th className="border px-3 py-2">Licencias</th>
              <th className="border px-3 py-2">Estado</th>
              <th className="border px-3 py-2">Fecha</th>
            </tr>
          </thead>

          <tbody>
            {pagos?.map((pago) => (
              <tr
                key={pago.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="border px-3 py-2">{pago.id}</td>
                <td className="border px-3 py-2">{pago.user_id}</td>
                <td className="border px-3 py-2">{pago.plugin_id}</td>
                <td className="border px-3 py-2">{pago.cantidad_licencias}</td>
                <td className="border px-3 py-2">{pago.estado}</td>
                <td className="border px-3 py-2">
                  {new Date(pago.fecha).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}