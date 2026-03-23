import { supabaseServer } from "@/lib/supabaseServer";
import PagoClient from "./PagoClient";

export default async function Page({ params }) {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return <div className="pt-32 px-6">No autenticado</div>;
  }

  const { id } = params;

  const { data: pago } = await supabase
    .from("pagos")
    .select("*, licencias(*)")
    .eq("id", id)
    .eq("user_id", userData.user.id)
    .single();

  if (!pago) {
    return <div className="pt-32 px-6">Pago no encontrado</div>;
  }

  return (
    <div className="max-w-3xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-6">Detalles del pago</h1>

      <PagoClient pago={pago} />
    </div>
  );
}
