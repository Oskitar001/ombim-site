import { supabaseServer } from "@/lib/supabaseServer";
import AsignarEmailsClient from "./AsignarEmailsClient";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const supabase = supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return <p className="p-6">Debes iniciar sesión.</p>;
  }

  const { pago_id } = params;

  const { data: pago } = await supabase
    .from("pagos")
    .select("*, licencias(*)")
    .eq("id", pago_id)
    .eq("user_id", userData.user.id)
    .single();

  if (!pago) {
    return <p className="p-6">Pago no encontrado.</p>;
  }

  return <AsignarEmailsClient pago={pago} />;
}