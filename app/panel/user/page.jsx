import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function PanelUsuarioPage() {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return <div className="text-center mt-20">Debes iniciar sesión.</div>;
  }

  const user = userData.user;
  const user_id = user.id;

  // Nombre del usuario (busca en todos los campos posibles)
  const nombreUsuario =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.nombre ||
    user.user_metadata?.username ||
    user.user_metadata?.displayName ||
    user.email;

  // Datos de facturación
  const { data: facturacion } = await supabase
    .from("facturacion")
    .select("*")
    .eq("user_id", user_id)
    .maybeSingle();

  // Nº de plugins comprados
  const { data: pagos } = await supabase
    .from("pagos")
    .select("id, plugin_id")
    .eq("user_id", user_id)
    .eq("estado", "aprobado");

  const totalPlugins = pagos?.length || 0;

  // Nº de licencias activas
  const { data: licencias } = await supabase
    .from("licencias")
    .select("id")
    .in(
      "plugin_id",
      pagos?.map((p) => p.plugin_id) || ["00000000-0000-0000-0000-000000000000"]
    );

  const totalLicencias = licencias?.length || 0;

  // Último pago
  const { data: ultimoPago } = await supabase
    .from("pagos")
    .select("fecha, plugins(nombre)")
    .eq("user_id", user_id)
    .eq("estado", "aprobado")
    .order("fecha", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Última descarga
  const { data: ultimaDescarga } = await supabase
    .from("descargas")
    .select("fecha, plugins(nombre)")
    .eq("user_id", user_id)
    .order("fecha", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      
      {/* Bienvenida */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de usuario</h1>

        {/* Nombre del usuario */}
        <p className="text-gray-900 text-xl font-semibold mt-2">
          {nombreUsuario}
        </p>

        {/* Email */}
        <p className="text-gray-600">{user.email}</p>
      </div>

      {/* Datos de facturación */}
      <div className="bg-white shadow border border-gray-200 rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Datos de facturación</h2>

        {facturacion ? (
          <div className="space-y-1 text-gray-700">
            <p><strong>Nombre:</strong> {facturacion.nombre}</p>
            <p><strong>NIF:</strong> {facturacion.nif}</p>
            <p><strong>Dirección:</strong> {facturacion.direccion}</p>
            <p><strong>Ciudad:</strong> {facturacion.ciudad}</p>
            <p><strong>CP:</strong> {facturacion.cp}</p>
            <p><strong>País:</strong> {facturacion.pais}</p>
            <p><strong>Teléfono:</strong> {facturacion.telefono}</p>

            <a
              href="/panel/mis-datos"
              className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Editar datos
            </a>
          </div>
        ) : (
          <a
            href="/panel/mis-datos"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Completar datos de facturación
          </a>
        )}
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Plugins */}
        <div className="bg-white shadow border border-gray-200 rounded p-6">
          <h3 className="text-lg font-semibold">Plugins adquiridos</h3>
          <p className="text-3xl font-bold mt-2">{totalPlugins}</p>
        </div>

        {/* Licencias */}
        <div className="bg-white shadow border border-gray-200 rounded p-6">
          <h3 className="text-lg font-semibold">Licencias activas</h3>
          <p className="text-3xl font-bold mt-2">{totalLicencias}</p>
        </div>

        {/* Último pago */}
        <div className="bg-white shadow border border-gray-200 rounded p-6">
          <h3 className="text-lg font-semibold">Último pago</h3>
          {ultimoPago ? (
            <p className="mt-2 text-gray-700">
              {ultimoPago.plugins?.nombre || "Plugin"}
              <br />
              <span className="text-sm text-gray-500">
                {new Date(ultimoPago.fecha).toLocaleString()}
              </span>
            </p>
          ) : (
            <p className="mt-2 text-gray-500 text-sm">Sin pagos todavía</p>
          )}
        </div>

        {/* Última descarga */}
        <div className="bg-white shadow border border-gray-200 rounded p-6 md:col-span-3">
          <h3 className="text-lg font-semibold">Última descarga</h3>
          {ultimaDescarga ? (
            <p className="mt-2 text-gray-700">
              {ultimaDescarga.plugins?.nombre || "Plugin"}
              <br />
              <span className="text-sm text-gray-500">
                {new Date(ultimaDescarga.fecha).toLocaleString()}
              </span>
            </p>
          ) : (
            <p className="mt-2 text-gray-500 text-sm">Sin descargas todavía</p>
          )}
        </div>

      </div>
    </div>
  );
}
