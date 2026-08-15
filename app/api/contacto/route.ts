import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nombre, email, telefono, mensaje } = body;

  if (!nombre || !email || !mensaje) {
    return NextResponse.json(
      { error: "Nombre, email y mensaje son requeridos" },
      { status: 400 }
    );
  }

  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #2A2118;">
      <div style="background-color: #2A2118; padding: 24px 28px; text-align: center;">
        <h1 style="margin: 0; font-size: 18px; letter-spacing: 0.15em; color: #FAFAF7; font-weight: 300;">LOMEI HOME</h1>
        <p style="margin: 4px 0 0; font-size: 9px; letter-spacing: 0.25em; color: #B5A898; text-transform: uppercase;">Nuevo mensaje de contacto</p>
      </div>
      <div style="padding: 28px; border: 1px solid #EDE6D6; border-top: none;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #B5A898; vertical-align: top; width: 90px;">Nombre</td>
            <td style="padding: 8px 0; font-size: 14px; color: #2A2118;">${nombre}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #B5A898; vertical-align: top;">Email</td>
            <td style="padding: 8px 0; font-size: 14px; color: #2A2118;"><a href="mailto:${email}" style="color: #A0845C;">${email}</a></td>
          </tr>
          ${telefono ? `<tr>
            <td style="padding: 8px 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #B5A898; vertical-align: top;">Teléfono</td>
            <td style="padding: 8px 0; font-size: 14px; color: #2A2118;"><a href="tel:${telefono}" style="color: #A0845C;">${telefono}</a></td>
          </tr>` : ""}
        </table>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #EDE6D6;">
          <p style="margin: 0 0 8px; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #B5A898;">Mensaje</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #2A2118; white-space: pre-wrap;">${mensaje}</p>
        </div>
      </div>
    </div>
  `;

  try {
    await sendEmail({
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER || "contacto@lomeihome.com",
      subject: `Nuevo mensaje de ${nombre} — LOMEI HOME`,
      html,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Error enviando email de contacto:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "No se pudo enviar el mensaje. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
