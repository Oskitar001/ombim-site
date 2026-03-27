// /app/api/admin/licencias/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
    const admin = await requireAdmin();
    if (!admin.ok) {
        return NextResponse.json({ error: "no_autorizado" }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
        .from("licencias")
        .select("*, plugins(nombre)")
        .order("fecha_creacion", { ascending: false });

    if (error) {
        console.error(error);
        return NextResponse.json({ error: "error_db" }, { status: 500 });
    }

    return NextResponse.json({ licencias: data ?? [] });
}