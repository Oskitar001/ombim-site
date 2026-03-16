import { createClient } from "@supabase/supabase-js";

export default async function PluginDetalle({ params }) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Obtener plugin
  const { data: plugin } = await supabase
    .from("plugins")
    .select("*")
    .eq("id", params.id)
    .single();

  // Obtener empresa logueada
  const { data: empresa } = await supabase
    .from("empresas")
    .select("id")
    .limit(1)
    .single();

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{plugin.nombre}</h1>

      {plugin.imagen_url && (
        <img
          src={plugin.imagen_url}
          className="w-full h-64 object-cover rounded mb-6"
        />
      )}

      {plugin.video_url && (
        <div className="mb-6">
          <iframe
            className="w-full h-80 rounded"
            src={plugin.video_url}
            title="Video del plugin"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <p className="text-gray-700 text-lg mb-6">{plugin.descripcion}</p>

      <div className="flex gap-4 mt-6">
        {/* DESCARGA DEMO */}
        {plugin.demo_url && (
          <a
            href={plugin.demo_url}
            className="bg-gray-800 text-white px-4 py-2 rounded"
            download
          >
            Descargar demo
          </a>
        )}

        {/* BOTÓN DE COMPRA */}
        <a
          href={`/api/stripe/checkout?plugin_id=${plugin.id}&empresa_id=${empresa?.id}`}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Comprar por {plugin.precio}€
        </a>
      </div>
    </div>
  );
}
