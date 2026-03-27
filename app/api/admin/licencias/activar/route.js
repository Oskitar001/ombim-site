// /app/api/admin/licencias/activar/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
    const admin = await requireAdmin();
    if (!admin.ok)
        return NextResponse.json({ error: "no_autorizado" }, { status: 403 });

    const { id } = await req.json();
    if (!id)
        return NextResponse.json({ error: "falta_id" }, { status: 400 });

    await supabaseAdmin
        .from("licencias")
        .update({ estado: "activa" })
        .eq("id", id);

    return NextResponse.json({ ok: true });
}