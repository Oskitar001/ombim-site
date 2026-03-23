export const dynamic = "force-dynamic";

import { supabaseServer } from "@/lib/supabaseServer";

export default async function PanelUsuarioPage() {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return <div className="text-center mt-20">Debes iniciar sesión.</div>;
  }

  const user = userData.user;
  const user_id = user.id;

  const nombreUsuario =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.nombre ||
    user.user_metadata?.username ||
    user.user_metadata?.displayName ||
    user.email;

  const { data: facturacion } = await supabase
    .from("facturacion")
    .select("*")
    .eq("user_id", user_id)
    .maybeSingle();

  const { data: pagos } = await supabase
    .from("pagos")
    .select("id, plugin_id")
    .eq("user_id", user_id)
    .eq("estado", "aprobado");

  const totalPlugins = pagos?.length || 0;

  const { data: licencias } = await supabase
    .from("licencias")
    .select("id")
    .in(
      "plugin_id",
      pagos?.map((p) => p.plugin_id) || ["00000000-0000-0000-0000-000000000000"]
    );

  const totalLicencias = licencias?.length || 0;

  const { data: ultimoPago } = await supabase
    .from("pagos")
    .select("fecha, plugins(nombre)")
    .eq("user_id", user_id)
    .eq("estado", "aprobado")
    .order("fecha", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: ultimaDescarga } = await supabase
    .from("descargas")
    .select("fecha, plugins(nombre)")
    .eq("user_id", user_id)
    .order("fecha", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Panel de usuario</h1>
      <p className="text-xl font-semibold">{nombreUsuario}</p>
      <p className="text-gray-600">{user.email}</p>

      {/* resto igual */}
    </div>
  );
}
