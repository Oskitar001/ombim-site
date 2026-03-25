import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { ArrowLeft, CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPagoDetallePage({ params }) {
  const auth = await requireAdmin();
  if (!auth.ok) return null;

  const { data, error } = await supabaseAdmin
    .from("pagos")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return <p className="text-red-500">Pago no encontrado</p>;
  }

  const pago = data;

  return (
    <div className="space-y-6">

      <a href="/panel/admin/pagos" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
        <ArrowLeft size={20} /> Volver
      </a>

      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CreditCard size={28} /> Pago {pago.id}
      </h1>

      <div className="p-6 rounded-lg bg-gray-200 dark:bg-gray-800 space-y-4">
        <p><strong>ID:</strong> {pago.id}</p>
        <p><strong>Usuario ID:</strong> {pago.user_id}</p>
        <p><strong>Plugin:</strong> {pago.plugin_id}</p>
        <p><strong>Licencias:</strong> {pago.cantidad_licencias}</p>
        <p><strong>Estado:</strong> {pago.estado}</p>
        <p><strong>Fecha:</strong> {new Date(pago.fecha).toLocaleString()}</p>
      </div>

    </div>
  );
}