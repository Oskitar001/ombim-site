import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { ArrowLeft, Ticket, ShieldCheck, Ban, RefreshCw } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLicenciaDetallePage({ params }) {
  const auth = await requireAdmin();
  if (!auth.ok) return null;

  // Obtener licencia
  const { data, error } = await supabaseAdmin
    .from("licencias")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data)
    return <p className="text-red-500">Licencia no encontrada</p>;

  const l = data;

  return (
    <div className="space-y-6">

      {/* VOLVER */}
      <a
        href="/panel/admin/licencias"
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
      >
        <ArrowLeft size={20} /> Volver
      </a>

      {/* TÍTULO */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Ticket size={28} /> Licencia {l.id}
      </h1>

      {/* DATOS */}
      <div className="p-6 rounded-lg bg-gray-200 dark:bg-gray-800 space-y-3">
        <p><strong>Plugin:</strong> {l.plugin_id}</p>
        <p><strong>Email Tekla:</strong> {l.email_tekla}</p>
        <p><strong>Estado:</strong> {l.estado}</p>
        <p>
          <strong>Activaciones:</strong> {l.activaciones_usadas} /{" "}
          {l.max_activaciones}
        </p>
        <p>
          <strong>Creada:</strong>{" "}
          {new Date(l.fecha_creacion).toLocaleString()}
        </p>
      </div>

      {/* ACCIONES */}
      <div className="flex flex-col gap-4 max-w-xs">

        {/* ACTIVAR */}
        <form action="/api/licencias/activar" method="POST">
          <input type="hidden" name="licencia_id" value={l.id} />
          <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            <ShieldCheck size={18} /> Activar
          </button>
        </form>

        {/* PONER TRIAL */}
        <form action="/api/licencias/trial" method="POST">
          <input type="hidden" name="licencia_id" value={l.id} />
          <button className="w-full flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-black px-4 py-2 rounded">
            <ShieldCheck size={18} /> Poner en Trial
          </button>
        </form>

        {/* BLOQUEAR */}
        <form action="/api/licencias/bloquear" method="POST">
          <input type="hidden" name="licencia_id" value={l.id} />
          <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            <Ban size={18} /> Bloquear
          </button>
        </form>

        {/* RESET ACTIVACIONES */}
        <form action="/api/licencias/reset-activaciones" method="POST">
          <input type="hidden" name="licencia_id" value={l.id} />
          <button className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
            <RefreshCw size={18} /> Reset Activaciones
          </button>
        </form>

      </div>
    </div>
  );
}