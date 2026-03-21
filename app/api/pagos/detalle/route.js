import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pago_id = searchParams.get("pago_id");

  if (!pago_id) {
    return NextResponse.json({ error: "Falta pago_id" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return NextResponse.json({ error: "NO_LOGIN" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: { headers: { Authorization: `Bearer ${session}` } },
    }
  );

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  // Obtener pago
  const { data: pago } = await supabase
    .from("pagos")
    .select("*")
    .eq("id", pago_id)
    .single();

  if (!pago || pago.user_id !== user.id) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  // Devolver cantidad de licencias compradas
  return NextResponse.json({
    pago,
    cantidad: pago.cantidad || 0
  });
}
