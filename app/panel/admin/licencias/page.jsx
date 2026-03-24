// /app/panel/admin/licencias/page.jsx
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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
    <div>
      <h1 className="text-xl mb-4 font-bold">Licencias</h1>

      {!licencias?.length && <p>No hay licencias todavía.</p>}

      <table className="w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Plugin</th>
            <th>Email Tekla</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {licencias?.map((l) => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.plugin_id}</td>
              <td>{l.email_tekla}</td>
              <td>{l.estado}</td>
              <td>{new Date(l.fecha_creacion).toLocaleString()}</td>
              <td>
                <a href={`/panel/admin/licencias/${l.id}`} className="underline">
                  Ver / Editar
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}