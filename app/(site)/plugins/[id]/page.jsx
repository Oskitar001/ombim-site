// app/(site)/plugins/[id]/page.jsx
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import PluginClient from "./PluginClient";

export const dynamic = "force-dynamic";

export default async function PluginPage({ params }) {
  const { id } = params;

  const { data: plugin, error } = await supabaseAdmin
    .from("plugins")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !plugin) {
    return <p>Plugin no encontrado.</p>;
  }

  return <PluginClient plugin={plugin} pluginId={id} />;
}
``