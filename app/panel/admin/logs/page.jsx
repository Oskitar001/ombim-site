import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminLogsPage() {
  const auth = await requireAdmin();
  if (!auth.ok) return null;

  const { data: logs } = await supabaseAdmin
    .from("admin_logs")
    .select("*")
    .order("fecha", { ascending: false });

  return (
    <div>
      <h1 className="text-xl mb-4 font-bold">Logs admin</h1>

      {!logs?.length && <p>No hay logs.</p>}

      {logs.map((l) => (
        <p key={l.id}>
          <strong>{l.tipo}</strong> — {l.mensaje}  
          <br />
          {new Date(l.fecha).toLocaleString()}
        </p>
      ))}
    </div>
  );
}