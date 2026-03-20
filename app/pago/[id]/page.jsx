import { notFound } from "next/navigation";
import { headers } from "next/headers";
import PagoClient from "./PagoClient";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function PagoPage({ params }) {
  const resolved = await params;
  const id = resolved.id;

  const hdr = await headers();
  const host = hdr.get("host");
  const protocol = host.includes("localhost") ? "http" : "https";

  // Obtener plugin
  const pluginURL = `${protocol}://${host}/api/plugin/${id}`;
  const res = await fetch(pluginURL, { cache: "no-store" });
  if (!res.ok) return notFound();
  const plugin = await res.json();

  // Obtener tipos de licencia
  const supabase = await supabaseServer();
  const { data: tipos } = await supabase
    .from("licencia_tipos")
    .select("*")
    .order("nombre", { ascending: true });

  // Obtener estado del pago
  const pagoURL = `${protocol}://${host}/api/pagos/estado?plugin_id=${id}`;
  const pagoRes = await fetch(pagoURL, {
    cache: "no-store",
    credentials: "include"
  });

  const pago = pagoRes.ok ? await pagoRes.json() : null;

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6">
      <h1 className="text-3xl font-bold mb-4">{plugin.nombre}</h1>

      <p className="text-lg font-semibold mb-6">
        {plugin.precio > 0 ? `${plugin.precio} €` : "Gratis"}
      </p>

      {/* Estado del pago */}
      {pago?.estado === "pendiente" && (
        <p className="text-yellow-600 font-semibold mb-6">
          Pago pendiente de confirmación.
        </p>
      )}

      {pago?.estado === "confirmado" && pago?.clave && (
        <div className="bg-green-100 p-4 rounded mb-6">
          <p className="font-semibold">Tu clave:</p>
          <p className="text-lg font-mono mt-1">{pago.clave}</p>
        </div>
      )}

      {/* Formulario de compra */}
      <PagoClient id={id} plugin={plugin} tipos={tipos || []} />
    </div>
  );
}
