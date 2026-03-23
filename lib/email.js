import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarEmail(to, subject, html) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
    console.error("❌ RESEND no está configurado correctamente");
    return false;
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error("Error enviando email:", err);
    return false;
  }
}

export function plantillaTransferenciaNotificada(usuario, pago) {
  const totalLicencias = pago.licencias?.length || 0;
  const licenciasAsignadas = pago.licencias?.filter(l => l.email_tekla)?.length || 0;
  const licenciasPendientes = totalLicencias - licenciasAsignadas;

  return `
    <div style="font-family: Arial; padding: 20px;">
      <h2>Transferencia notificada</h2>

      <p>El usuario <strong>${usuario}</strong> ha notificado una transferencia.</p>

      <h3>Datos del pago</h3>
      <p><strong>ID del pago:</strong> ${pago.id}</p>
      <p><strong>Plugin:</strong> ${pago.plugin_id}</p>
      <p><strong>Importe:</strong> ${pago.importe ?? "—"} €</p>
      <p><strong>Fecha:</strong> ${new Date(pago.created_at).toLocaleString()}</p>

      <h3>Licencias</h3>
      <p><strong>Total:</strong> ${totalLicencias}</p>
      <p><strong>Asignadas:</strong> ${licenciasAsignadas}</p>
      <p><strong>Pendientes:</strong> ${licenciasPendientes}</p>

      <h3>Validación</h3>
      <p>
        <a href="https://tudominio.com/admin/pagos/${pago.id}"
           style="display:inline-block;padding:10px 15px;background:#2563eb;color:white;text-decoration:none;border-radius:5px;">
          Validar pago
        </a>
      </p>
    </div>
  `;
}
