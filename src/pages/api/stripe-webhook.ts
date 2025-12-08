import type { APIRoute } from "astro";
import { createHmac, timingSafeEqual } from "node:crypto";

export const prerender = false;

type StripeEvent = {
  type: string;
  data?: {
    object?: {
      id?: string;
      customer_details?: { email?: string };
      customer_email?: string;
    };
  };
};

type ParsedSignature = {
  timestamp: string;
  signatures: string[];
};

const parseSignatureHeader = (signature: string): ParsedSignature | null => {
  const parts = signature.split(",");
  const data: ParsedSignature = { timestamp: "", signatures: [] };

  for (const part of parts) {
    const [key, value] = part.split("=");
    if (key === "t") data.timestamp = value;
    if (key === "v1" && value) data.signatures.push(value);
  }

  if (!data.timestamp || data.signatures.length === 0) return null;
  return data;
};

const isSignatureValid = (payload: string, signatureHeader: string, secret: string) => {
  const parsed = parseSignatureHeader(signatureHeader);
  if (!parsed) return false;

  const signedPayload = `${parsed.timestamp}.${payload}`;
  const expected = createHmac("sha256", secret).update(signedPayload).digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  return parsed.signatures.some((signature) => {
    const signatureBuffer = Buffer.from(signature, "hex");
    if (signatureBuffer.length !== expectedBuffer.length) return false;
    return timingSafeEqual(signatureBuffer, expectedBuffer);
  });
};

const getStripeEvent = async (request: Request, secret: string) => {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    throw new Error("Falta la firma del webhook");
  }

  const payload = await request.text();

  if (!isSignatureValid(payload, signature, secret)) {
    throw new Error("Firma inválida");
  }

  const event = JSON.parse(payload) as StripeEvent;
  return { event, payload };
};

const sendConfirmationEmail = async (email: string, purchaseId: string) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) return;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: import.meta.env.EMAIL_FROM || "Zensory <no-reply@zensory.com>",
        to: [email],
        subject: "Confirmación de tu compra",
        html: `
          <p>¡Gracias por tu compra!</p>
          <p>Tu identificador de compra es <strong>${purchaseId}</strong>.</p>
          <p>Guárdalo para cualquier duda o seguimiento.</p>
        `,
      }),
    });
  } catch (error) {
    console.error("No se pudo enviar el correo de confirmación", error);
  }
};

export const POST: APIRoute = async ({ request }) => {
  const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new Response("Stripe no está configurado", { status: 500 });
  }

  let parsedEvent: { event: StripeEvent; payload: string };
  try {
    parsedEvent = await getStripeEvent(request, webhookSecret);
  } catch (error) {
    console.error("Error verificando webhook", error);
    return new Response("Firma inválida", { status: 400 });
  }

  if (parsedEvent.event.type === "checkout.session.completed") {
    const session = parsedEvent.event.data?.object;
    const email = session?.customer_details?.email || session?.customer_email;
    const purchaseId = session?.id;

    if (email && purchaseId) {
      await sendConfirmationEmail(email, purchaseId);
    }
  }

  return new Response("ok");
};
