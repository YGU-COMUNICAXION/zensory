import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request, url }) => {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY;
  const defaultPriceId = import.meta.env.STRIPE_PRICE_ID;

  if (!secretKey) {
    return new Response("Stripe no está configurado", { status: 500 });
  }

  const body = await request.json().catch(() => null) as {
    name?: string;
    email?: string;
    priceId?: string;
  } | null;

  if (!body?.email) {
    return new Response("Falta el correo del comprador", { status: 400 });
  }

  const priceId = body.priceId || defaultPriceId;
  if (!priceId) {
    return new Response("No se encontró el plan de pago", { status: 400 });
  }

  const successUrl = new URL("/compra-exitosa", url).toString();
  const cancelUrl = new URL("/compra-cancelada", url).toString();

  try {
    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("customer_email", body.email);
    params.set("metadata[buyer_name]", body.name || "");
    params.set("line_items[0][price]", priceId);
    params.set("line_items[0][quantity]", "1");
    params.set("success_url", `${successUrl}?session_id={CHECKOUT_SESSION_ID}`);
    params.set("cancel_url", cancelUrl);

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Stripe Checkout error", errorText);
      return new Response("No se pudo iniciar el pago", { status: 500 });
    }

    const session = (await response.json()) as { url?: string };

    if (!session.url) {
      return new Response("No se generó la URL de pago", { status: 500 });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Stripe Checkout error", error);
    return new Response("No se pudo iniciar el pago", { status: 500 });
  }
};
