// /app/panel/mis-datos/page.jsx
import { supabaseServer } from "@/lib/supabaseServer";
import MisDatosClient from "./MisDatosClient";

export const dynamic = "force-dynamic";

export default async function MisDatosPage() {
  const supabase = await supabaseServer();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return <p>Debes iniciar sesión.</p>;
  }

  const { data: facturacion } = await supabase
    .from("facturacion")
    .select("*")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  return (
    <div>
      <h2>Datos de facturación</h2>
      <MisDatosClient initialData={facturacion} />
    </div>
  );
}
