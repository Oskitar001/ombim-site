import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { nombre, email, mensaje } = await req.json();
    if (!nombre || !email || !mensaje) {
      return new Response(JSON.stringify({ ok: false, error: "Faltan campos" }), { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,            // smtp.office365.com
      port: Number(process.env.SMTP_PORT),    // 587
      secure: process.env.SMTP_SECURE === "true", // false -> STARTTLS
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM,            // "OMBIM <o.martinez@ombim.com>"
      to: process.env.MAIL_TO,                // p.ej. "o.martinez@ombim.com"
      replyTo: email,
      subject: `Nuevo mensaje desde OMBIM: ${nombre}`,
      text: `Nombre: ${nombre}\nEmail: ${email}\n\n${mensaje}`,
      html: `
        <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.6">
          <h2>Nuevo mensaje desde OMBIM</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px">${mensaje}</pre>
        </div>
      `
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error("SMTP ERROR:", error);
    return new Response(JSON.stringify({ ok: false, error: "Error del servidor" }), { status: 500 });
  }
}