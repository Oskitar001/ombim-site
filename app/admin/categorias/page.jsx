import { createClient } from "@supabase/supabase-js";

export default async function CategoriasAdmin() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data: categorias } = await supabase
    .from("categorias")
    .select("*")
    .order("creado_en", { ascending: false });

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Categorías</h1>

      <a
        href="/admin/categorias/nuevo"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Nueva categoría
      </a>

      <div className="mt-6">
        {categorias?.map((c) => (
          <div key={c.id} className="p-4 bg-white shadow rounded mb-3">
            {c.nombre}
          </div>
        ))}
      </div>
    </div>
  );
}
