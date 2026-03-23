export const dynamic = "force-dynamic";

import { supabaseServer } from "@/lib/supabaseServer";
import PagosClient from "./PagosClient";

export default async function MisPagosPage() {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return <div className="text-center mt-20">No autenticado</div>;
  }

  const { data: pagos } = await supabase
    .from("pagos")
    .select("*, plugins(nombre)")
    .eq("user_id", userData.user.id)
    .order("fecha", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Mis pagos</h1>
      <PagosClient pagos={pagos || []} />
    </div>
  );
}
