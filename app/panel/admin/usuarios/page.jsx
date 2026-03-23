import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminUsuariosPage() {
  const admin = await requireAdmin();

  // Igual que en pagos: si no es admin → fuera
  if (!admin) {
    return (
      <div className="pt-32 px-6">
        Acceso denegado.
      </div>
    );
  }

  // Obtener lista de usuarios desde Supabase Admin
  const { data: usuarios, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    return (
      <div className="pt-32 px-6">
        Error al cargar usuarios.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>

      {!usuarios?.users?.length && <p>No hay usuarios.</p>}

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios?.users?.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border">{u.id}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">
                {u.user_metadata?.role || "user"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
