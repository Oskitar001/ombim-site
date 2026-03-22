import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminLicenciasPage() {
  const admin = await requireAdmin();
  if (!admin) {
    return <div className="pt-32 px-6">Acceso denegado.</div>;
  }

  const { data: licencias } = await supabaseAdmin
    .from("licencias")
    .select("id, plugin_id, email_tekla, estado, fecha_creacion")
    .order("fecha_creacion", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-5xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-4">Licencias</h1>

      {!licencias?.length && <p>No hay licencias todavía.</p>}

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Plugin</th>
            <th className="p-2 border">Email Tekla</th>
            <th className="p-2 border">Estado</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {licencias?.map((l) => (
            <tr key={l.id}>
              <td className="p-2 border">{l.id}</td>
              <td className="p-2 border">{l.plugin_id}</td>
              <td className="p-2 border">{l.email_tekla}</td>
              <td className="p-2 border">{l.estado}</td>
              <td className="p-2 border">
                {l.fecha_creacion
                  ? new Date(l.fecha_creacion).toLocaleString()
                  : "-"}
              </td>
              <td className="p-2 border">
                <a
                  href={`/panel/admin/licencias/${l.id}`}
                  className="text-blue-600 underline"
                >
                  Ver / editar
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
