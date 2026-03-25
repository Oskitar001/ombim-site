// /app/api/email/plantillas/activadas.js

export const PLANTILLA_ACTIVADAS = `
<!DOCTYPE html>
<html lang="es" style="font-family:Arial;">
<body style="background:#f3f4f6;padding:0;margin:0;">

<div style="max-width:580px;margin:40px auto;background:white;padding:32px;border-radius:12px;
     box-shadow:0 4px 12px rgba(0,0,0,0.08);">

  <h2 style="text-align:center;color:#111827;margin-bottom:20px;">
    Tus licencias OMBIM han sido activadas
  </h2>

  <p style="font-size:16px;color:#374151;">
    Ya puedes usar tu plugin de OMBIM. Se han activado las licencias para los siguientes emails Tekla:
  </p>

  <ul style="color:#374151;font-size:15px;">
    {{lista_emails}}
  </ul>

  <p style="font-size:16px;color:#4b5563;margin-top:20px;">
    Si ya tienes el plugin instalado en Tekla, simplemente ábrelo y se activará automáticamente.
  </p>

  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />

  <p style="text-align:center;color:#9ca3af;font-size:12px;">
    © OMBIM – Herramientas BIM profesionales
  </p>

</div>
</body>
</html>
`;