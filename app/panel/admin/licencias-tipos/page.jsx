import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminLicenciasTiposPage() {
  const auth = await requireAdmin();
  if (!auth.ok) return null;

  const { data: tipos } = await supabaseAdmin
    .from("licencias_tipos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl mb-4 font-bold">Tipos de licencia</h1>

      {!tipos?.length && <p>No hay tipos de licencia.</p>}

      <table>
        {/* ... */}
      </table>
    </div>
  );
}