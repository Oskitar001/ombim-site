import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminUsuariosPage() {
  const auth = await requireAdmin();
  if (!auth.ok) return null;

  const { data } = await supabaseAdmin.auth.admin.listUsers();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Usuarios</h1>

      {!data?.users?.length && <p>No hay usuarios.</p>}

      <table> {/* … */} </table>
    </div>
  );
}