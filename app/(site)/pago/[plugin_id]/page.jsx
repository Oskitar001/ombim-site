import { supabaseServer } from "@/lib/supabaseServer";
import CompraLicencias from "./CompraLicencias";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const supabase = supabaseServer();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return <p className="p-6">Debes iniciar sesión para continuar.</p>;
  }

  const { plugin_id } = params;

  const { data: plugin, error } = await supabase
    .from("plugins")
    .select("*")
    .eq("id", plugin_id)
    .single();

  if (error || !plugin) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Plugin no encontrado</h1>
      </div>
    );
  }

  return <CompraLicencias plugin={plugin} user={userData.user} />;
}
