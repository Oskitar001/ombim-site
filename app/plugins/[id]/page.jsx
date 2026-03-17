import { notFound } from "next/navigation";
import RecibirClaves from "./RecibirClaves";

export default async function PluginPage({ params }) {
  const { id } = params;

  // Obtener datos del plugin
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/plugin/${id}`, {
    cache: "no-store"
  });

  if (!res.ok) return notFound();

  const plugin = await res.json();
  const esDePago = plugin.precio && plugin.precio > 0;

  // Obtener estado del pago del usuario
  const pagoRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pagos/estado?plugin_id=${id}`, {
    cache: "no-store",
    credentials: "include"
  });

  const pago = pagoRes.ok ? await pagoRes.json() : null;

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        {plugin.nombre}
      </h1>

      {/* Precio */}
      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
        {esDePago ? `${plugin.precio} €` : "Gratis"}
      </p>

      <p className="text-gray-700 dark:text-gray-300 mb-6">
        {plugin.descripcion}
      </p>

      {plugin.video_url && (
        <iframe
          className="w-full aspect-video rounded-lg mb-6 shadow"
          src={convertToEmbed(plugin.video_url)}
          allowFullScreen
        ></iframe>
      )}

      {/* LÓGICA DE COMPRA / PAGO / CLAVES */}
      {esDePago ? (
        <div className="mt-6">

          {/* 1. Si NO hay pago → botón ir a pagar */}
          {!pago && (
            <a
              href={`/pago/${id}`}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition inline-block"
            >
              Ir al pago
            </a>
          )}

          {/* 2. Si el pago está pendiente */}
          {pago?.estado === "pendiente" && (
            <p className="text-yellow-600 font-semibold">
              Pago pendiente de confirmación.  
              Óscar lo revisará pronto.
            </p>
          )}

          {/* 3. Si el pago está confirmado → botón recibir claves */}
          {pago?.estado === "confirmado" && !pago?.clave && (
            <RecibirClaves pluginId={id} />
          )}

          {/* 4. Si ya tiene clave entregada */}
          {pago?.clave && (
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded mt-4">
              <p className="font-semibold text-green-700 dark:text-green-300">
                Ya tienes tu clave:
              </p>
              <p className="text-green-800 dark:text-green-200 text-lg font-mono mt-1">
                {pago.clave}
              </p>
            </div>
          )}
        </div>
      ) : (
        <a
          href={plugin.archivo_url}
          download
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition inline-block"
        >
          Descargar plugin
        </a>
      )}
    </div>
  );
}

function convertToEmbed(url) {
  if (!url) return null;

  if (url.includes("youtu.be")) {
    return "https://www.youtube.com/embed/" + url.split("youtu.be/")[1];
  }

  if (url.includes("watch?v=")) {
    return "https://www.youtube.com/embed/" + url.split("watch?v=")[1].split("&")[0];
  }

  return url;
}
