// /app/panel/mis-plugins/page.jsx
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function MisPluginsPage() {
  const supabase = await supabaseServer();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) return <p>Debes iniciar sesión para ver tus plugins.</p>;

  const { data: pagos } = await supabase
    .from("pagos")
    .select("id, plugin_id, estado, fecha, cantidad_licencias, plugins(nombre, descripcion)")
    .eq("user_id", userData.user.id)
    .neq("estado", "pendiente");

  const pluginIds = [...new Set((pagos ?? []).map((p) => p.plugin_id))];

  const { data: licencias } = await supabase
    .from("licencias")
    .select("*")
    .in("plugin_id", pluginIds.length ? pluginIds : ["00000000"]);

  const licByPlugin = (licencias ?? []).reduce((acc, l) => {
    acc[l.plugin_id] = acc[l.plugin_id] ?? [];
    acc[l.plugin_id].push(l);
    return acc;
  }, {});

  return (
    <div>
      <h2>Mis plugins</h2>

      {!pagos?.length && <p>No has comprado plugins todavía.</p>}

      {(pagos ?? []).map((p) => {
        const plugin = p.plugins;
        const lic = licByPlugin[p.plugin_id] ?? [];

        return (
          <div key={p.id}>
            <h3>{plugin?.nombre ?? "Plugin"}</h3>
            <p>{plugin?.descripcion}</p>
            <p>Compra: {new Date(p.fecha).toLocaleString()}</p>
            <p>Estado: {p.estado}</p>

            <h4>Licencias asociadas</h4>

            {!lic.length ? (
              <p>No hay licencias asociadas todavía.</p>
            ) : (
              <ul>
                {lic.map((l) => (
                  <li key={l.id}>
                    {l.email_tekla} — {l.estado} — {l.activaciones_usadas}/{l.max_activaciones}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}