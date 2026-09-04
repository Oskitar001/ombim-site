// /app/api/admin/licencias/hacer-anual/route.js
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export async function POST(req) {
    const admin = await requireAdmin();
    if (!admin.ok) return Response.json({ error: "no_autorizado" }, { status: 403 });

    const { id } = await req.json();
    if (!id) return Response.json({ error: "falta_id" }, { status: 400 });

    const exp = new Date();
    exp.setFullYear(exp.getFullYear() + 1);

    await supabaseAdmin
        .from("licencias")
        .update({
            tipo: "anual",
            max_activaciones: 1,
            fecha_expiracion: exp.toISOString()
        })
        .eq("id", id);

    return Response.json({ ok: true });
}