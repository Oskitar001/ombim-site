import { supabaseRoute } from "@/lib/supabaseRoute";

export async function POST(req) {
  const supabase = supabaseRoute();
  const { user_id, plugin_id, emails_tekla } = await req.json();

  // emails_tekla = ["email1@...", "email2@...", "email3@..."]

  const { data, error } = await supabase
    .from("pagos")
    .insert({
      user_id,
      plugin_id,
      cantidad_licencias: emails_tekla.length,
      estado: "pendiente",
      fecha: new Date().toISOString(),
      emails_tekla
    })
    .select()
    .single();

  if (error) return Response.json({ error }, { status: 500 });

  // TODO: enviar email
  return Response.json({ ok: true, pago: data });
}