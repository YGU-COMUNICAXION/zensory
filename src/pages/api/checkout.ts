import type { APIRoute } from "astro";

export const prerender = false;

// Precio fijo configurado directamente en el código. Ajusta este ID con el Price
// creado en tu cuenta de Stripe.
const FIXED_PRICE_ID = "price_1Sc9jU2SrCRvBA2aLlNlROYz"; // TODO: reemplaza con tu Price ID real
// creado en tu cuenta de Stripe. Debe existir en el mismo modo (test/live) que
// la clave secreta que uses.
const FIXED_PLAN = {
  id: "price_1Sc9jU2SrCRvBA2aLlNlROYz", // TODO: reemplaza con tu Price ID real
  title: "Acceso completo al curso",
  priceLabel: "$4,444 MXN",
};

export const POST: APIRoute = async ({ request, url }) => {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return new Response("Stripe no está configurado", { status: 500 });
  }

  const body = await request.json().catch(() => null) as {
    name?: string;
    email?: string;
    plan?: string;
  } | null;

  if (!body?.email) {
    return new Response("Falta el correo del comprador", { status: 400 });
  }

  if (!FIXED_PLAN.id || FIXED_PLAN.id.includes("12345") || !FIXED_PLAN.id.startsWith("price_")) {
    return new Response(
      "Configura el Price ID real de Stripe en src/pages/api/checkout.ts",
      { status: 500 },
    );
  }

  if (body?.plan && body.plan !== FIXED_PLAN.id) {
    return new Response("El plan seleccionado no es válido", { status: 400 });
  }

  const priceId = FIXED_PLAN.id;

  const successUrl = new URL("/compra-exitosa", url).toString();
  const cancelUrl = new URL("/compra-cancelada", url).toString();

  try {
    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("customer_email", body.email);
    params.set("metadata[buyer_name]", body.name || "");
    params.set("metadata[buyer_email]", body.email || "");
    params.set("metadata[plan_title]", FIXED_PLAN.title);
    params.set("metadata[plan_price_label]", FIXED_PLAN.priceLabel);
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

      let message = "No se pudo iniciar el pago. Verifica el Price ID y que coincida el modo (test o live) con tu clave.";
      try {
        const parsed = JSON.parse(errorText) as { error?: { message?: string } };
        if (parsed?.error?.message) {
          message = parsed.error.message;
        }
      } catch {
        // Si no es JSON, deja el mensaje genérico.
      }

      return new Response(message, { status: 500 });
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
