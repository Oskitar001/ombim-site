import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req, ctx) {
  const { id } = await ctx.params;

  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json(admin, { status: 403 });
  }

  const { data: pago, error } = await supabaseAdmin
    .from("pagos")
    .select("*, pagos_emails(email_tekla)")
    .eq("id", id)
    .maybeSingle();

  if (error || !pago) {
    return NextResponse.json({ error: "pago_no_encontrado" }, { status: 404 });
  }

  const emails = pago.pagos_emails?.map((x) => x.email_tekla) ?? [];

  const { data: facturacion } = await supabaseAdmin
    .from("facturacion")
    .select("*")
    .eq("user_id", pago.user_id)
    .maybeSingle();

  return NextResponse.json({
    pago: {
      ...pago,
      emails,
    },
    facturacion,
  });
}