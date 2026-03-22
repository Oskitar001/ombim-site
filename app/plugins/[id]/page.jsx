import { notFound } from "next/navigation";
import PluginClient from "./PluginClient";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function PluginPage({ params }) {
  const { id } = await params;

  const supabase = await supabaseServer();

  const { data: plugin, error } = await supabase
    .from("plugins")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !plugin) {
    notFound();
  }

  return <PluginClient plugin={plugin} pluginId={id} />;
}
