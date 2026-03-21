import { supabaseAdmin } from "./supabaseAdmin";

// Guarda logs de acciones administrativas
export async function logAdminAction({ tipo, mensaje, user_id }) {
  try {
    await supabaseAdmin.from("admin_logs").insert([
      {
        tipo,
        mensaje,
        user_id,
        fecha: new Date().toISOString()
      }
    ]);
  } catch (err) {
    console.error("Error guardando log admin:", err);
  }
}
