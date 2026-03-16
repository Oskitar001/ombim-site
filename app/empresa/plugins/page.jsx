import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export default async function PluginsPage() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data: plugins } = await supabase
    .from("plugins")
    .select("*")
    .eq("activo", true);

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Plugins disponibles</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plugins?.map((plugin) => (
          <Link
            key={plugin.id}
            href={`/empresa/plugins/${plugin.id}`}
            className="bg-white shadow rounded p-4 hover:shadow-lg transition"
          >
            {plugin.imagen_url && (
              <img
                src={plugin.imagen_url}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}

            <h2 className="text-xl font-bold">{plugin.nombre}</h2>
            <p className="text-gray-600 mt-2 line-clamp-3">
              {plugin.descripcion}
            </p>

            <p className="mt-4 font-semibold text-green-700">
              {plugin.precio}€
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
