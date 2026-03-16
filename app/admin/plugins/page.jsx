import { createClient } from "@supabase/supabase-js";

export default async function AdminPlugins() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data: plugins } = await supabase
    .from("plugins")
    .select("*")
    .order("creado_en", { ascending: false });

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Plugins / APIs</h1>

      <a
        href="/admin/plugins/nuevo"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Nuevo plugin
      </a>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {plugins?.map((p) => (
          <div key={p.id} className="bg-white shadow p-4 rounded">
            {p.imagen_url && (
              <img
                src={p.imagen_url}
                className="w-full h-40 object-cover rounded"
              />
            )}

            <h2 className="text-xl font-bold mt-3">{p.nombre}</h2>
            <p className="text-gray-600 mt-2">{p.descripcion}</p>

            <div className="mt-4 flex gap-3">
              <a
                href={`/admin/plugins/${p.id}`}
                className="text-blue-600 underline"
              >
                Editar
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
