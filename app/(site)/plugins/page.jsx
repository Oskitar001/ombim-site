// app/(site)/plugins/page.jsx
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PluginsPage() {
  // Obtener plugins desde tu API pública admin
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/plugin`, {
    cache: "no-store",
  });
  const plugins = await res.json();

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold">Plugins OMBIM</h1>

      {!plugins?.length && (
        <p>No hay plugins disponibles todavía.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plugins.map((p) => (
          <div
            key={p.id}
            className="bg-gray-200 dark:bg-gray-800 p-5 rounded-lg shadow flex flex-col gap-4"
          >
            {/* FOTO DEL PLUGIN */}
            <div className="h-40 bg-white dark:bg-gray-900 rounded flex justify-center items-center overflow-hidden shadow-inner">
              <img
                src={p.imagen_url ?? "/plugin-placeholder.png"}
                alt={p.nombre}
                className="object-cover h-full w-full"
              />
            </div>

            {/* TITULO */}
            <h2 className="text-xl font-semibold">{p.nombre}</h2>

            {/* PRECIO */}
            <p className="font-bold">
              {p.precio > 0 ? `${p.precio} €` : "Gratis"}
            </p>

            {/* BOTONES */}
            <div className="flex flex-col gap-2">
              <Link
                href={`/plugins/${p.id}`}
                className="w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
              >
                Ver plugin
              </Link>

              {/* DESCARGAR TRIAL (solo si logueado) */}
              <TrialButton pluginId={p.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ======================
// BOTÓN "DESCARGAR TRIAL"
// ======================
async function TrialButton({ pluginId }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/me`, {
    cache: "no-store",
  });
  const me = await res.json();

  if (!me?.user) {
    return (
      <Link
        href="/login"
        className="w-full bg-gray-500 text-white text-center py-2 rounded hover:bg-gray-600 transition"
      >
        Iniciar sesión para descargar
      </Link>
    );
  }

  return (
    <a
      href={`/api/plugin/download?plugin_id=${pluginId}`}
      className="w-full bg-green-600 text-white text-center py-2 rounded hover:bg-green-700 transition"
    >
      Descargar Trial
    </a>
  );
}