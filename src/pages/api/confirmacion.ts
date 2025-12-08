import type { APIRoute } from "astro";

export const prerender = false;

const sendConfirmationEmail = async (email: string, purchaseId: string) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) return false;

  try {
    const response = await fetch("https://api.resend.com/emails", {
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

    return response.ok;
  } catch (error) {
    console.error("No se pudo enviar el correo de confirmación", error);
    return false;
  }
};

export const POST: APIRoute = async ({ request }) => {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return new Response("Stripe no está configurado", { status: 500 });
  }

  const body = await request.json().catch(() => null) as { sessionId?: string } | null;
  const sessionId = body?.sessionId;

  if (!sessionId) {
    return new Response("Falta session_id", { status: 400 });
  }

  try {
    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      },
    );

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error("Stripe session fetch error", errorText);
      return new Response("No se pudo validar la compra", { status: 400 });
    }

    const session = await stripeResponse.json() as {
      id?: string;
      payment_status?: string;
      customer_details?: { email?: string };
      customer_email?: string;
    };

    const email = session.customer_details?.email || session.customer_email;
    const purchaseId = session.id;

    if (session.payment_status !== "paid" || !email || !purchaseId) {
      return new Response("La compra no está confirmada", { status: 400 });
    }

    const sent = await sendConfirmationEmail(email, purchaseId);

    return new Response(JSON.stringify({ emailSent: sent }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error validando la compra", error);
    return new Response("Error interno", { status: 500 });
  }
};
