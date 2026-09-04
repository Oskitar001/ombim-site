// /app/panel/facturacion/page.jsx
import { supabaseServer } from "@/lib/supabaseServer";
import FacturacionClient from "./FacturacionClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = await supabaseServer();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return <p>No autenticado</p>;
  }

  const { data: facturacion } = await supabase
    .from("facturacion")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  return (
    <div>
      <h2>Datos de facturación</h2>
      <FacturacionClient user_id={userData.user.id} datosIniciales={facturacion} />
    </div>
  );
}