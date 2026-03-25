// app/(site)/plugins/page.jsx
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PluginsPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/plugin`,
    { cache: "no-store" }
  );

  let plugins = [];

  try {
    const data = await res.json();
    plugins = Array.isArray(data) ? data : [];
  } catch {
    plugins = [];
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-4">
      {/* AQUI EL ARREGLO REAL */}
      <h1 className="text-3xl font-bold mt-16">Plugins OMBIM</h1>

      {!plugins.length && (
        <p className="text-gray-500 text-lg">
          No hay plugins disponibles todavía.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plugins.map((p) => (
          <div
            key={p.id}
            className="bg-gray-200 dark:bg-gray-800 p-5 rounded-lg shadow flex flex-col gap-4"
          >
            {p.imagen_url && (
              <img
                src={p.imagen_url}
                alt={p.nombre}
                className="w-full rounded-md object-cover"
              />
            )}

            <h3 className="text-xl font-semibold">{p.nombre}</h3>

            {p.descripcion && (
              <p className="text-sm opacity-80">{p.descripcion}</p>
            )}

            <p className="font-bold">
              {p.precio > 0 ? `${p.precio} €` : "Gratis"}
            </p>

            <div className="flex gap-3 mt-auto">
              <Link
                href={`/plugins/${p.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center w-full"
              >
                Ver plugin
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}