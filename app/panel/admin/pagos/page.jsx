import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminPagosPage() {
  const auth = await requireAdmin();
  if (!auth.ok) return null;

  const { data: pagos } = await supabaseAdmin
    .from("pagos")
    .select("id, user_id, plugin_id, cantidad_licencias, estado, fecha")
    .order("fecha", { ascending: false });

  return (
    <div>
      <h1 className="text-xl mb-4 font-bold">Pagos</h1>

      {!pagos?.length && <p>No hay pagos aún.</p>}

      <table> {/* … */} </table>
    </div>
  );
}