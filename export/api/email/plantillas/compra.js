// /app/api/email/plantillas/compra.js

export const PLANTILLA_COMPRA = `
<!DOCTYPE html>
<html lang="es" style="font-family: Arial, sans-serif;">
<body style="background:#f9fafb;padding:0;margin:0;">

<div style="max-width:580px;margin:40px auto;background:white;padding:32px;border-radius:12px;
     box-shadow:0 4px 12px rgba(0,0,0,0.08);">

  <h2 style="color:#1f2937;text-align:center;margin-bottom:20px;">
    Compra recibida – OMBIM
  </h2>

  <p style="font-size:16px;color:#374151;">
    Hemos recibido tu compra del plugin <strong>{{plugin_nombre}}</strong>.
  </p>

  <p style="margin-top:20px;font-size:16px;color:#4b5563;">
    Emails Tekla asignados a esta compra:
  </p>

  <ul style="color:#374151;font-size:15px;">
    {{lista_emails}}
  </ul>

  <p style="margin-top:20px;font-size:16px;color:#4b5563;">
    Para completar la compra, realiza una transferencia bancaria a:
  </p>

  <div style="background:#e5e7eb;padding:12px;border-radius:6px;">
    <p><strong>Cuenta bancaria:</strong> {{cuenta_banco}}</p>
    <p><strong>Concepto:</strong> Pago OMBIM Nº {{pago_id}}</p>
    <p><strong>Importe:</strong> {{precio}}€</p>
  </div>

  <p style="margin-top:20px;font-size:16px;color:#4b5563;">
    Cuando validemos la transferencia, activaremos tus licencias y te avisaremos por email.
  </p>

  <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />

  <p style="text-align:center;color:#9ca3af;font-size:12px;">
    © OMBIM – Herramientas BIM para Tekla Structures
  </p>

</div>
</body>
</html>
`;