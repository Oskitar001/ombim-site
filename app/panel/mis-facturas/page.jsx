import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function MisFacturasPage() {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return <div className="text-center mt-20">Debes iniciar sesión para ver tus facturas.</div>;
  }

  // Usamos pagos aprobados como base de facturas
  const { data: pagos } = await supabase
    .from("pagos")
    .select("id, plugin_id, fecha, estado, plugins(nombre)")
    .eq("user_id", userData.user.id)
    .eq("estado", "aprobado")
    .order("fecha", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Mis facturas</h1>

      {!(pagos || []).length && <p>No tienes facturas todavía.</p>}

      <div className="space-y-4">
        {(pagos || []).map((pago) => (
          <div
            key={pago.id}
            className="bg-white shadow border border-gray-200 rounded p-4 flex justify-between items-center"
          >
            <div>
              <p>
                <span className="font-semibold">Plugin:</span>{" "}
                {pago.plugins?.nombre || pago.plugin_id}
              </p>
              <p className="text-sm text-gray-500">
                Fecha: {new Date(pago.fecha).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() =>
                window.open(`/api/facturacion/pdf?pago_id=${pago.id}`, "_blank")
              }
              className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
            >
              Descargar factura
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
