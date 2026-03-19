import PagoClient from "./PagoClient";
import { createClient } from "@supabase/supabase-js";

export default async function Page({ params }) {
  // ⬅️ IMPORTANTE: desestructurar params con await
  const { id } = await params;

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data: plugin } = await supabase
    .from("plugins")
    .select("*")
    .eq("id", id)
    .single();

  const { data: tiposLicencia } = await supabase
    .from("licencia_tipos")
    .select("*");

  if (!plugin) {
    return <div style={{ padding: 20 }}>❌ Plugin no encontrado</div>;
  }

  if (!tiposLicencia) {
    return <div style={{ padding: 20 }}>❌ Error cargando tipos de licencia</div>;
  }

  return <PagoClient plugin={plugin} tiposLicencia={tiposLicencia} />;
}
