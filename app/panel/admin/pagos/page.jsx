import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminPagosPage() {
  const admin = await requireAdmin();
  if (!admin) {
    return <div className="pt-32 px-6">Acceso denegado.</div>;
  }

  const { data: pagos } = await supabaseAdmin
    .from("pagos")
    .select("id, user_id, plugin_id, cantidad_licencias, estado, fecha")
    .order("fecha", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-4">Pagos</h1>

      {!pagos?.length && <p>No hay pagos todavía.</p>}

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Usuario</th>
            <th className="p-2 border">Plugin</th>
            <th className="p-2 border">Licencias</th>
            <th className="p-2 border">Estado</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pagos?.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border">{p.id}</td>
              <td className="p-2 border">{p.user_id}</td>
              <td className="p-2 border">{p.plugin_id}</td>
              <td className="p-2 border">{p.cantidad_licencias}</td>
              <td className="p-2 border">{p.estado}</td>
              <td className="p-2 border">
                {p.fecha ? new Date(p.fecha).toLocaleString() : "-"}
              </td>
              <td className="p-2 border">
                <a
                  href={`/panel/admin/pagos/${p.id}`}
                  className="text-blue-600 underline"
                >
                  Ver / gestionar
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
