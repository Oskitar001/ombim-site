import { supabaseServer } from "@/lib/supabaseServer";
import PagosClient from "./PagosClient";

export default async function Page() {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return <div className="pt-32 px-6">No autenticado</div>;
  }

  const { data: pagos } = await supabase
    .from("pagos")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-6">Mis pagos</h1>

      <PagosClient pagos={pagos || []} />
    </div>
  );
}
