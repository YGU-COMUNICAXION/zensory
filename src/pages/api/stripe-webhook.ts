import type { APIRoute } from "astro";
import { createHmac, timingSafeEqual } from "node:crypto";
import { sendConfirmationEmail } from "../../lib/email";

export const prerender = false;

const verifyStripeSignature = (payload: string, signature: string, secret: string) => {
  const parts = signature.split(",").reduce<Record<string, string>>((acc, part) => {
    const [key, value] = part.split("=");
    if (key && value) acc[key] = value;
    return acc;
  }, {});

  const timestamp = parts["t"];
  const v1 = parts["v1"];

  if (!timestamp || !v1) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const expected = createHmac("sha256", secret).update(signedPayload).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(v1, "hex"));
  } catch (error) {
    console.error("No se pudo validar la firma del webhook", error);
    return false;
  }
};

export const POST: APIRoute = async ({ request }) => {
  const secret = import.meta.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Stripe webhook no configurado", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.arrayBuffer();
  const payload = new TextDecoder().decode(rawBody);

  if (!signature || !verifyStripeSignature(payload, signature, secret)) {
    return new Response("Firma inválida", { status: 400 });
  }

  try {
    const event = JSON.parse(payload) as {
      id: string;
      type: string;
      data?: { object?: { id?: string; payment_status?: string; customer_details?: { email?: string }; customer_email?: string } };
    };

    if (event.type !== "checkout.session.completed") {
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    const session = event.data?.object;
    const email = session?.customer_details?.email || session?.customer_email;
    const purchaseId = session?.id;
    const paid = session?.payment_status === "paid";

    if (!purchaseId || !email || !paid) {
      console.error("Webhook sin email, purchaseId o pago no confirmado", { purchaseId, email, paid });
      return new Response("Faltan datos", { status: 400 });
    }

    const sent = await sendConfirmationEmail(email, purchaseId, email);

    return new Response(JSON.stringify({ received: true, emailSent: sent }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error procesando webhook", error);
    return new Response("Error", { status: 500 });
  }
};
