import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminPluginsPage() {
  const auth = await requireAdmin();
  if (!auth.ok) return null;

  const { data: plugins } = await supabaseAdmin
    .from("plugins")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl mb-4 font-bold">Plugins</h1>

      <a href="/panel/admin/plugins/nuevo" className="underline block mb-4">
        Nuevo plugin
      </a>

      {!plugins?.length && <p>No hay plugins.</p>}
      {/* … */}
    </div>
  );
}