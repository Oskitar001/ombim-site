// /app/panel/mis-pagos/page.jsx
import { supabaseServer } from "@/lib/supabaseServer";
import PagosClient from "./PagosClient";

export const dynamic = "force-dynamic";

export default async function MisPagosPage() {
  const supabase = await supabaseServer();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) return <p>No autenticado</p>;

  const { data: pagos } = await supabase
    .from("pagos")
    .select("*, plugins(nombre)")
    .eq("user_id", userData.user.id)
    .order("fecha", { ascending: false });

  return (
    <div>
      <h2>Mis pagos</h2>
      <PagosClient pagos={pagos ?? []} />
    </div>
  );
}