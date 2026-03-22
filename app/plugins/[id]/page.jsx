import { supabaseAdmin } from "@/lib/supabaseAdmin";
import PluginClient from "./PluginClient";

export default async function PluginPage({ params }) {
  const { id } = params;

  const { data: plugin, error } = await supabaseAdmin
    .from("plugins")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !plugin) {
    return <div className="pt-32 px-6">Plugin no encontrado</div>;
  }

  return <PluginClient plugin={plugin} pluginId={id} />;
}
