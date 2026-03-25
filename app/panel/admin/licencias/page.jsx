import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Ticket, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLicenciasPage() {
  const auth = await requireAdmin();
  if (!auth.ok) return null;

  const { data: licencias } = await supabaseAdmin
    .from("licencias")
    .select("id, plugin_id, email_tekla, estado, fecha_creacion")
    .order("fecha_creacion", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">

      {/* TÍTULO */}
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Ticket size={24} /> Licencias
      </h1>

      {!licencias?.length && (
        <p>No hay licencias todavía.</p>
      )}

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-left">
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Plugin</th>
              <th className="border px-3 py-2">Email Tekla</th>
              <th className="border px-3 py-2">Estado</th>
              <th className="border px-3 py-2">Fecha</th>
              <th className="border px-3 py-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {licencias?.map((l) => (
              <tr
                key={l.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="border px-3 py-2">{l.id}</td>
                <td className="border px-3 py-2">{l.plugin_id}</td>
                <td className="border px-3 py-2">{l.email_tekla}</td>
                <td className="border px-3 py-2">{l.estado}</td>
                <td className="border px-3 py-2">
                  {new Date(l.fecha_creacion).toLocaleString()}
                </td>

                <td className="border px-3 py-2">
                  <a
                    href={`/panel/admin/licencias/${l.id}`}
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center gap-1"
                  >
                    <Eye size={18} /> Ver / Editar
                  </a>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}