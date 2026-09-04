// /app/api/admin/licencias/hacer-completa/route.js
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export async function POST(req) {
    const admin = await requireAdmin();
    if (!admin.ok) return Response.json({ error: "no_autorizado" }, { status: 403 });

    const { id } = await req.json();
    if (!id) return Response.json({ error: "falta_id" }, { status: 400 });

    await supabaseAdmin
        .from("licencias")
        .update({
            tipo: "completa",
            max_activaciones: 5,
            fecha_expiracion: null
        })
        .eq("id", id);

    return Response.json({ ok: true });
}
``