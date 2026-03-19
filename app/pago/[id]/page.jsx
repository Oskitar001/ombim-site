import PagoClient from "./PagoClient";
import { createClient } from "@supabase/supabase-js";

export default async function Page({ params }) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data: plugin } = await supabase
    .from("plugins")
    .select("*")
    .eq("id", params.id)
    .single();

  const { data: tiposLicencia } = await supabase
    .from("licencia_tipos")
    .select("*");

  return <PagoClient plugin={plugin} tiposLicencia={tiposLicencia} />;
}
