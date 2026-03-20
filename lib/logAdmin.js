import { supabaseAdmin } from "./supabaseAdmin";

export async function logAdminAction(admin, accion, detalles = {}) {
  await supabaseAdmin.from("admin_logs").insert([
    {
      admin_email: admin.email,
      accion,
      detalles,
    },
  ]);
}
