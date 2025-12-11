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
    const debugLog: Array<Record<string, unknown>> = [];
    debugLog.push({ step: "start", sessionId });

    const stripeResponse = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error("Stripe session fetch error", errorText);
      debugLog.push({ step: "stripe_fetch_failed", status: stripeResponse.status, errorText });
      return new Response(
        JSON.stringify({ message: "No se pudo validar la compra", debugLog }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
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
        email_sent?: string;
        email_sent_at?: string;
      };
    };

    const purchaseId = session.id;
    const buyerName = session.metadata?.buyer_name || undefined;
    const buyerEmail = session.metadata?.buyer_email || undefined;
    const amountLabel = session.metadata?.price_label || undefined;
    const recipientEmail =
      buyerEmail || session.customer_details?.email || session.customer_email;
    const emailAlreadySent = session.metadata?.email_sent === "true";
    const alreadySentAt = session.metadata?.email_sent_at;

    debugLog.push({
      step: "session_parsed",
      payment_status: session.payment_status,
      recipientEmail,
      buyerEmail,
      buyerName,
      amountLabel,
      emailAlreadySent,
      alreadySentAt,
    });

    if (session.payment_status !== "paid" || !recipientEmail || !purchaseId) {
      debugLog.push({
        step: "session_rejected",
        reason: "missing paid status or recipient",
      });
      return new Response(
        JSON.stringify({ message: "La compra no está confirmada", debugLog }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (emailAlreadySent) {
      console.log("[confirmacion] Correo ya registrado como enviado", {
        purchaseId,
        recipientEmail,
        alreadySentAt,
      });
      debugLog.push({ step: "email_already_sent", alreadySentAt });
      return new Response(
        JSON.stringify({ emailSent: false, alreadySent: true, debugLog }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
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
    debugLog.push({ step: "email_attempted", sent });
    console.log("[confirmacion] Correo disparado", { purchaseId, recipientEmail, sent });

    if (sent) {
      const updateBody = new URLSearchParams({
        "metadata[email_sent]": "true",
        "metadata[email_sent_at]": new Date().toISOString(),
      });

      const updateResponse = await fetch(`https://api.stripe.com/v1/checkout/sessions/${purchaseId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: updateBody.toString(),
      });

      const updateOk = updateResponse.ok;
      if (!updateOk) {
        const updateError = await updateResponse.text();
        console.error("[confirmacion] No se pudo marcar email_sent en metadata", updateError);
        debugLog.push({ step: "metadata_update_failed", updateError, status: updateResponse.status });
      } else {
        debugLog.push({ step: "metadata_marked_sent" });
      }
    }

    return new Response(JSON.stringify({ emailSent: sent, debugLog }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error validando la compra", error);
    return new Response(
      JSON.stringify({ message: "Error interno", error: `${error}` }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
