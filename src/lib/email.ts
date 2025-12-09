import nodemailer from "nodemailer";

// Parámetros fijos para la marca y la plantilla. Ajústalos en el código según tu branding.
const brandName = "Zensory";
const brandLogoUrl = "https://placehold.co/600x200?text=Zensory";
const courseStartText =
  "Tu curso iniciará pronto. Te enviaremos más detalles y accesos en tu correo.";
const supportEmail = "soporte@zensory.mx";
const emailFrom = `${brandName} <tu-correo@gmail.com>`;

// Configuración SMTP fija para usar con Nodemailer.
// Ejemplo listo para Gmail con una contraseña de aplicación de 16 dígitos:
// 1) Activa 2FA en tu cuenta de Gmail.
// 2) Genera una "App password" para "Mail" en "Other" (o "Correo" → "Otro").
// 3) Sustituye user y pass con tu correo y la contraseña de aplicación.
const smtpConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "tu-correo@gmail.com",
    pass: "contraseña-de-aplicación-gmail",
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

export const buildConfirmationHtml = (
  purchaseId: string,
  buyerEmail?: string,
  buyerName?: string,
  amountLabel?: string,
) => `
  <table width="100%" bgcolor="#0B0B14" style="padding: 32px 0; font-family: 'Helvetica Neue', Arial, sans-serif; color: #ffffff;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #111827; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="padding: 32px; text-align: center; background: linear-gradient(135deg, #C084FC, #7C3AED);">
              <img src="${brandLogoUrl}" alt="${brandName}" width="180" style="display: block; margin: 0 auto 16px;" />
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">¡Pago confirmado!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; font-size: 16px; color: #E5E7EB;">${buyerName ? `Hola ${buyerName}, ` : ""}gracias por tu compra. Hemos registrado tu pago de forma segura.</p>
              <p style="margin: 0 0 16px; font-size: 16px; color: #E5E7EB;">${courseStartText}</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0; background: #1F2937; border-radius: 10px; padding: 16px;">
                <tr>
                  <td style="font-size: 12px; letter-spacing: 1px; color: #A5B4FC; text-transform: uppercase;">ID de compra</td>
                </tr>
                <tr>
                  <td style="font-size: 18px; font-weight: 700; color: #F3F4F6; padding-top: 8px;">${purchaseId}</td>
                </tr>
                ${buyerEmail ? `<tr><td style="padding-top: 12px; font-size: 14px; color: #D1D5DB;">Correo: ${buyerEmail}</td></tr>` : ""}
                ${buyerName ? `<tr><td style="padding-top: 4px; font-size: 14px; color: #D1D5DB;">Nombre: ${buyerName}</td></tr>` : ""}
                ${amountLabel ? `<tr><td style="padding-top: 4px; font-size: 14px; color: #D1D5DB;">Monto: ${amountLabel}</td></tr>` : ""}
              </table>
              <p style="margin: 0 0 12px; font-size: 14px; color: #D1D5DB;">Guarda este identificador para cualquier consulta. Si tienes dudas, responde a este correo o escríbenos a <a href="mailto:${supportEmail}" style="color: #C084FC;">${supportEmail}</a>.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px; background: #0B0B14; font-size: 12px; color: #9CA3AF; text-align: center;">
              ${brandName} · Confirmación de pago
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

export const sendConfirmationEmail = async (
  email: string,
  purchaseId: string,
  buyerEmail?: string,
  buyerName?: string,
  amountLabel?: string,
) => {
  try {
    console.log("[correo] Preparando correo de confirmación", {
      to: email,
      purchaseId,
      buyerEmail,
      buyerName,
      amountLabel,
    });

    const html = buildConfirmationHtml(purchaseId, buyerEmail, buyerName, amountLabel);

    const info = await transporter.sendMail({
      from: emailFrom,
      to: email,
      subject: `${brandName} · Confirmación de tu compra`,
      html,
    });

    const accepted = Boolean(info.accepted?.length);
    console.log("[correo] Resultado del envío", { accepted, messageId: info.messageId });

    return accepted;
  } catch (error) {
    console.error("No se pudo enviar el correo de confirmación", error);
    return false;
  }
};
