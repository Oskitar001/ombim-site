// /app/api/plugin/validate-license/route.js
import { NextResponse } from "next/server"; 
import { supabaseAdmin } from "@/lib/supabaseAdmin"; 

export async function POST(req) { 
 let payload; 
 try { 
  payload = await req.json(); 
 } catch { 
  return NextResponse.json({ estado: "error", mensaje: "json_invalido" }); 
 } 

 // Normalización segura 
 const email_tekla = payload?.email_tekla?.trim()?.toLowerCase(); 
 const plugin_id = payload?.plugin_id; 
 const maquina_id = payload?.maquina_id; 

 if (!email_tekla || !plugin_id) { 
  return NextResponse.json({ 
   estado: "error", 
   mensaje: "Datos incompletos" 
  }); 
 } 

 // obtener licencia 
 const { data: lic, error } = await supabaseAdmin 
  .from("licencias") 
  .select("*") 
  
  .eq("plugin_id", plugin_id) 
  .order("fecha_creacion", { ascending: false }) 
  .limit(1) 
  .maybeSingle(); 

 if (error || !lic) { 
  console.error("Error obteniendo licencia:", error); 
  return NextResponse.json({ estado: "sin_licencia" }); 
 } 

 // bloqueada 
 if (lic.estado === "bloqueada") { 
  return NextResponse.json({ estado: "bloqueada" }); 
 } 

 // pendiente 
 if (lic.estado === "pendiente") { 
  return NextResponse.json({ estado: "pendiente" }); 
 } 

 // expiración 
 if (lic.fecha_expiracion) { 
  const exp = new Date(lic.fecha_expiracion); 
  if (exp < new Date()) { 
   return NextResponse.json({ estado: "expirada" }); 
  } 
 } 

 // 🔥 NUEVA LÓGICA DE MÁQUINAS
 const { data: maquinas } = await supabaseAdmin
  .from("licencias_maquinas")
  .select("maquina_id")
  .eq("licencia_id", lic.id);

 const maquinasIds = (maquinas ?? []).map(m => m.maquina_id);
 const max = Number(lic.max_activaciones ?? 0);

 // ✅ si YA existe → NO consume activación
 if (maquina_id && maquinasIds.includes(maquina_id)) {
  return NextResponse.json({
   estado: lic.estado,
   activaciones_restantes: max - maquinasIds.length,
   fecha_expiracion: lic.fecha_expiracion ?? null
  });
 }

 // ❌ sin activaciones disponibles
 if (maquinasIds.length >= max) {
  return NextResponse.json({ estado: "sin_activaciones" });
 }

 // ✅ registrar nueva máquina
 const { error: insertErr } = await supabaseAdmin
  .from("licencias_maquinas")
  .insert({
   licencia_id: lic.id,
   maquina_id,
   fecha: new Date().toISOString()
  });

 if (insertErr) {
  console.error("Error activando licencia:", insertErr);
  return NextResponse.json({ estado: "error_actualizando" });
 }

 return NextResponse.json({
  estado: lic.estado,
  activaciones_restantes: max - (maquinasIds.length + 1),
  fecha_expiracion: lic.fecha_expiracion ?? null
 });
}