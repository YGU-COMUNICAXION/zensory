import type { APIRoute } from "astro";
import { sendConfirmationEmail } from "../../lib/email";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return new Response("Stripe no está configurado", { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as { sessionId?: string } | null;
  const sessionId = body?.sessionId;

  if (!sessionId) {
    return new Response("Falta session_id", { status: 400 });
  }

  try {
    const stripeResponse = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error("Stripe session fetch error", errorText);
      return new Response("No se pudo validar la compra", { status: 400 });
    }

    const session = (await stripeResponse.json()) as {
      id?: string;
      payment_status?: string;
      customer_details?: { email?: string };
      customer_email?: string;
      metadata?: {
        buyer_name?: string;
        buyer_email?: string;
        course_title?: string;
        price_label?: string;
      };
    };

    const purchaseId = session.id;
    const buyerName = session.metadata?.buyer_name || undefined;
    const buyerEmail = session.metadata?.buyer_email || undefined;
    const amountLabel = session.metadata?.price_label || undefined;
    const recipientEmail =
      buyerEmail || session.customer_details?.email || session.customer_email;

    if (session.payment_status !== "paid" || !recipientEmail || !purchaseId) {
      return new Response("La compra no está confirmada", { status: 400 });
    }

    console.log("[confirmacion] Sesión pagada validada", {
      purchaseId,
      recipientEmail,
      buyerEmail,
      buyerName,
      amountLabel,
    });

    const sent = await sendConfirmationEmail(
      recipientEmail,
      purchaseId,
      buyerEmail,
      buyerName,
      amountLabel,
    );
    console.log("[confirmacion] Correo disparado", { purchaseId, recipientEmail, sent });

    return new Response(JSON.stringify({ emailSent: sent }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error validando la compra", error);
    return new Response("Error interno", { status: 500 });
  }
};
