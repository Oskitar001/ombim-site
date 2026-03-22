import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminLogsPage() {
  const admin = await requireAdmin();
  if (!admin) return <div className="pt-32 px-6">Acceso denegado.</div>;

  const { data: logs } = await supabaseAdmin
    .from("admin_logs")
    .select("*")
    .order("fecha", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-5xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-4">Logs admin</h1>

      {!logs?.length && <p>No hay logs.</p>}

      <ul className="space-y-2 text-sm">
        {logs?.map((l) => (
          <li key={l.id} className="border p-2 rounded">
            <p>
              <strong>{l.tipo}</strong> — {l.mensaje}
            </p>
            <p className="text-gray-500">
              {l.fecha ? new Date(l.fecha).toLocaleString() : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
