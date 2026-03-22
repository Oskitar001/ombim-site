import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminPluginsPage() {
  const admin = await requireAdmin();
  if (!admin) return <div className="pt-32 px-6">Acceso denegado.</div>;

  const { data: plugins } = await supabaseAdmin
    .from("plugins")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-4">Plugins</h1>

      <a
        href="/panel/admin/plugins/nuevo"
        className="inline-block mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Nuevo plugin
      </a>

      {!plugins?.length && <p>No hay plugins.</p>}

      {plugins?.map((p) => (
        <div key={p.id} className="border p-4 rounded mb-3">
          <p className="font-semibold">{p.nombre}</p>
          <p>{p.descripcion}</p>
          <p className="mt-1">{p.precio} €</p>
          <div className="mt-2 flex gap-3">
            <a
              href={`/panel/admin/plugins/editar/${p.id}`}
              className="text-blue-600 underline"
            >
              Editar
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
