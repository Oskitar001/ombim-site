// /app/panel/admin/licencias/[id]/page.jsx
import { requireAdmin } from "@/lib/checkAdmin";

export const dynamic = "force-dynamic";

export default async function AdminLicenciaDetallePage({ params }) {
  const auth = await requireAdmin();
  if (!auth.ok) return null;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/licencias/${params.id}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  if (!data?.licencia) return <p>Licencia no encontrada</p>;

  const l = data.licencia;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Licencia {l.id}</h1>

      <p><strong>Plugin:</strong> {l.plugin_id}</p>
      <p><strong>Email Tekla:</strong> {l.email_tekla}</p>
      <p><strong>Estado:</strong> {l.estado}</p>
      <p><strong>Activaciones:</strong> {l.activaciones_usadas} / {l.max_activaciones}</p>

      <div className="flex flex-col gap-4 mt-6 max-w-xs">

        {/* ACTIVAR */}
        <form action="/api/licencias/activar" method="POST">
          <input type="hidden" name="licencia_id" value={l.id} />
          <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
            Activar
          </button>
        </form>

        {/* TRIAL */}
        <form action="/api/licencias/trial" method="POST">
          <input type="hidden" name="licencia_id" value={l.id} />
          <button className="bg-yellow-600 text-white px-4 py-2 rounded w-full">
            Poner en Trial
          </button>
        </form>

        {/* BLOQUEAR */}
        <form action="/api/licencias/bloquear" method="POST">
          <input type="hidden" name="licencia_id" value={l.id} />
          <button className="bg-red-600 text-white px-4 py-2 rounded w-full">
            Bloquear
          </button>
        </form>

        {/* RESET ACTIVACIONES */}
        <form action="/api/licencias/reset-activaciones" method="POST">
          <input type="hidden" name="licencia_id" value={l.id} />
          <button className="bg-purple-600 text-white px-4 py-2 rounded w-full">
            Reset Activaciones
          </button>
        </form>

      </div>
    </div>
  );
}