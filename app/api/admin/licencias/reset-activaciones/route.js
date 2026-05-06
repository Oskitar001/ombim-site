// /app/api/admin/licencias/reset-activaciones/route.js
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

 // ✅ CAMBIO: ahora borramos las máquinas en vez de resetear contador
 await supabaseAdmin
  .from("licencias_maquinas")
  .delete()
  .eq("licencia_id", id);

 return NextResponse.json({ ok: true }); 
}