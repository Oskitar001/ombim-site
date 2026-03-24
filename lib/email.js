// lib/email.js
// Envío profesional de emails con Resend

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
    console.error("❌ Error enviando email:", err);
    return false;
  }
}

export function plantillaTransferenciaNotificada(usuario, pago) {
  const totalLicencias = pago.licencias?.length ?? 0;
  const licenciasAsignadas = pago.licencias?.filter(l => l.email_tekla)?.length ?? 0;
  const licenciasPendientes = totalLicencias - licenciasAsignadas;

  return `
    <h2>Transferencia notificada</h2>
    <p>El usuario ${usuario} ha notificado una transferencia.</p>

    <h3>Datos del pago</h3>
    <p>ID del pago: ${pago.id}</p>
    <p>Plugin: ${pago.plugin_id}</p>
    <p>Importe: ${pago.importe ?? "—"} €</p>
    <p>Fecha: ${new Date(pago.created_at).toLocaleString()}</p>

    <h3>Licencias</h3>
    <p>Total: ${totalLicencias}</p>
    <p>Asignadas: ${licenciasAsignadas}</p>
    <p>Pendientes: ${licenciasPendientes}</p>

    <p><a href="https://ombim.com/admin/pagos/${pago.id}">Validar pago</a></p>
  `;
}