import { enviarEmail } from "@/lib/email";

export async function POST(req) {
  // ... lo que ya teníamos

  // Obtener usuario y licencias
  const { data: pagoDetalle } = await supabaseAdmin
    .from("pagos")
    .select("user_id, licencias(email_tekla)")
    .eq("id", pago_id)
    .single();

  const { data: user } = await supabaseAdmin.auth.admin.getUserById(
    pagoDetalle.user_id
  );

  const emailsTekla = pagoDetalle.licencias.map((l) => l.email_tekla);

  const html = `
    <div style="font-family: Arial; padding: 20px;">
      <h2>Tus licencias han sido activadas</h2>
      <p>Se han activado las licencias para los siguientes emails de Tekla:</p>
      <ul>
        ${emailsTekla.map((e) => `<li>${e}</li>`).join("")}
      </ul>
      <p>Gracias por confiar en OMBIM.</p>
    </div>
  `;

  if (user?.user?.email) {
    await enviarEmail(user.user.email, "Licencias activadas", html);
  }

  return NextResponse.json({ ok: true });
}
