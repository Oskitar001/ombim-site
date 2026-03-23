export const dynamic = "force-dynamic";

import { supabaseServer } from "@/lib/supabaseServer";
import MisDatosClient from "./MisDatosClient";

export default async function MisDatosPage() {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return <div className="text-center mt-20">Debes iniciar sesión.</div>;
  }

  const { data: facturacion } = await supabase
    .from("facturacion")
    .select("*")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Datos de facturación</h1>
      <MisDatosClient initialData={facturacion} />
    </div>
  );
}
