// /app/panel/mis-facturas/page.jsx
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function MisFacturasPage() {
  const supabase = await supabaseServer();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return <p>Debes iniciar sesión para ver tus facturas.</p>;
  }

  const { data: pagos } = await supabase
    .from("pagos")
    .select("id, plugin_id, fecha, estado, plugins(nombre)")
    .eq("user_id", userData.user.id)
    .eq("estado", "aprobado")
    .order("fecha", { ascending: false });

  return (
    <div>
      <h2>Mis facturas</h2>

      {!pagos?.length && <p>No tienes facturas todavía.</p>}

      {pagos?.map((p) => (
        <div key={p.id}>
          <p>Plugin: {p.plugins?.nombre ?? p.plugin_id}</p>
          <p>Fecha: {new Date(p.fecha).toLocaleString()}</p>

          <a
            href={`/api/facturacion/pdf?pago_id=${p.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Descargar factura
          </a>
        </div>
      ))}
    </div>
  );
}