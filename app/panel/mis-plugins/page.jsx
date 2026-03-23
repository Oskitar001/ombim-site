import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function MisPluginsPage() {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return <div className="text-center mt-20">Debes iniciar sesión para ver tus plugins.</div>;
  }

  // Plugins comprados por el usuario (pagos)
  const { data: pagos } = await supabase
    .from("pagos")
    .select("id, plugin_id, estado, fecha, cantidad_licencias, plugins(nombre, descripcion)")
    .eq("user_id", userData.user.id)
    .neq("estado", "pendiente");

  const pluginIds = [...new Set((pagos || []).map((p) => p.plugin_id))];

  // Licencias asociadas a esos plugins
  const { data: licencias } = await supabase
    .from("licencias")
    .select("*")
    .in("plugin_id", pluginIds.length ? pluginIds : ["00000000-0000-0000-0000-000000000000"]);

  const licenciasPorPlugin = (licencias || []).reduce((acc, l) => {
    acc[l.plugin_id] = acc[l.plugin_id] || [];
    acc[l.plugin_id].push(l);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Mis plugins</h1>

      {!(pagos || []).length && <p>No has comprado ningún plugin todavía.</p>}

      <div className="space-y-4">
        {(pagos || []).map((pago) => {
          const plugin = pago.plugins;
          const lic = licenciasPorPlugin[pago.plugin_id] || [];

          return (
            <div
              key={pago.id}
              className="bg-white shadow border border-gray-200 rounded p-4 space-y-3"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {plugin?.nombre || "Plugin"}
                  </h2>
                  {plugin?.descripcion && (
                    <p className="text-sm text-gray-600 mt-1">{plugin.descripcion}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Compra: {new Date(pago.fecha).toLocaleString()} · Estado: {pago.estado}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Licencias asociadas</h3>
                {lic.length ? (
                  <ul className="list-disc ml-6 text-sm">
                    {lic.map((l) => (
                      <li key={l.id}>
                        {l.email_tekla} · {l.estado} · {l.activaciones_usadas}/
                        {l.max_activaciones}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">
                    No hay licencias asociadas todavía.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
