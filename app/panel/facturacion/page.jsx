export const dynamic = "force-dynamic"; // ⬅️ ESTO ES LO QUE EVITA EL ERROR

import { supabaseServer } from "@/lib/supabaseServer";
import FacturacionClient from "./FacturacionClient";

export default async function Page() {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return <div className="pt-32 px-6">No autenticado</div>;
  }

  const { data: facturacion } = await supabase
    .from("facturacion")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-6">Datos de facturación</h1>

      <FacturacionClient
        user_id={userData.user.id}
        datosIniciales={facturacion}
      />
    </div>
  );
}
