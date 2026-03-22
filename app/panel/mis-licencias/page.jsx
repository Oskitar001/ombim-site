import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function MisLicenciasPage() {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return (
      <div className="pt-32 px-6">
        Debes iniciar sesión para ver tus licencias.
      </div>
    );
  }

  const { data: licencias } = await supabase
    .from("licencias")
    .select("*, plugins(nombre)")
    .eq("user_id", userData.user.id); // si decides guardar user_id en licencias

  return (
    <div className="max-w-3xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-4">Mis licencias</h1>

      {!licencias?.length && <p>No tienes licencias todavía.</p>}

      {licencias?.map((l) => (
        <div key={l.id} className="border p-4 rounded mb-3">
          <p>
            <strong>Plugin:</strong> {l.plugins?.nombre || l.plugin_id}
          </p>
          <p>
            <strong>Email Tekla:</strong> {l.email_tekla}
          </p>
          <p>
            <strong>Estado:</strong> {l.estado}
          </p>
        </div>
      ))}
    </div>
  );
}
