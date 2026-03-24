// app/api/admin/pagos/[id]/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(_, { params }) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json(admin, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("pagos")
    .select("*, licencias(*), facturacion(*)")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ pago: data });
}