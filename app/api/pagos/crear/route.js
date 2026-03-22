import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const { plugin_id, licencias } = body;

  if (!plugin_id || !licencias || !licencias.length) {
    return NextResponse.json(
      { error: "Datos incompletos" },
      { status: 400 }
    );
  }

  const cantidad_licencias = licencias.length;

  const { data: pago, error } = await supabase
    .from("pagos")
    .insert({
      user_id: userData.user.id,
      plugin_id,
      cantidad_licencias,
      estado: "pendiente",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const licRows = licencias.map((l) => ({
    pago_id: pago.id,
    plugin_id,
    email_tekla: l.email_tekla || "",
    estado: "trial",
  }));

  const { error: licError } = await supabase.from("licencias").insert(licRows);

  if (licError) {
    return NextResponse.json({ error: licError.message }, { status: 500 });
  }

  return NextResponse.json({ pago_id: pago.id });
}
