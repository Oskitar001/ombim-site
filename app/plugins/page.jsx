import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function PluginsPage() {
  const { data: plugins } = await supabaseAdmin
    .from("plugins")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6">
      <h1 className="text-3xl font-bold mb-8">Plugins</h1>
      {plugins?.map((p) => (
        <div key={p.id} className="mb-6 border p-4 rounded">
          <a href={`/plugins/${p.id}`} className="text-xl font-semibold text-blue-600">
            {p.nombre}
          </a>
          <p>{p.descripcion}</p>
          <p className="mt-2 font-semibold">
            {p.precio > 0 ? `${p.precio} €` : "Gratis"}
          </p>
        </div>
      ))}
    </div>
  );
}
