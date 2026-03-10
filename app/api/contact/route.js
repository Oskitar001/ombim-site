import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { nombre, email, mensaje } = await req.json();

    await resend.emails.send({
      from: "OMBIM <onboarding@resend.dev>",
      to: "tucorreo@dominio.com",
      subject: "Nuevo mensaje desde el formulario",
      html: `
        <h2>Nuevo mensaje desde la web</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error enviando correo:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
