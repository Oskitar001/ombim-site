import { notFound } from "next/navigation";
import PluginClient from "./PluginClient";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function PluginPage({ params }) {
  // Next.js 16: params es una promesa
  const resolved = await params;
  const id = resolved.id;

  const supabase = await supabaseServer();

  const { data: plugin, error } = await supabase
    .from("plugins")
    .select("*")
    .eq("id", id)   // ← IMPORTANTE: buscamos por id
    .single();

  if (error || !plugin) notFound();

  return <PluginClient plugin={plugin} pluginId={id} />;
}
