import { supabaseAdmin } from "./supabaseAdmin";

export async function generarNumeroFactura() {
  // 1. Obtener valor actual
  const { data, error } = await supabaseAdmin
    .from("facturas_contador")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) {
    throw new Error("Error obteniendo contador");
  }

  const nuevoNumero = data.ultimo_numero + 1;

  // 2. Guardar nuevo valor
  const { error: updateError } = await supabaseAdmin
    .from("facturas_contador")
    .update({ ultimo_numero: nuevoNumero })
    .eq("id", 1);

  if (updateError) {
    throw new Error("Error actualizando contador");
  }

  // 3. Formato F-000X
  const numeroFormateado = `F-${String(nuevoNumero).padStart(4, "0")}`;

  return numeroFormateado;
}