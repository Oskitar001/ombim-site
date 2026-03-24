import { requireAdmin } from "@/lib/checkAdmin";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminUsuariosPage() {
  const auth = await requireAdmin();

  if (!auth.ok) {
    redirect(auth.redirect);
  }

  const { data: usuarios, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    return (
      <div className="p-10">
        Error al cargar usuarios.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-10">
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
