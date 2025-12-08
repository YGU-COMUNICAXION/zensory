# Zensory

Landing page de Astro para el curso de manifestación con sonido. Incluye una sección de compra integrada con Stripe Checkout y envíos de correo de confirmación mediante el webhook.

## Requisitos

- Node.js 18+
- Cuenta de Stripe con un Price ID configurado
- Clave de Resend (u otro proveedor SMTP compatible con la API HTTP de Resend)

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las claves necesarias:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_xxx
EMAIL_FROM="Zensory <no-reply@zensory.com>"
PUBLIC_STRIPE_PRICE_ID=price_... # opcional para mostrar en el formulario
```

- `STRIPE_PRICE_ID` es el plan por defecto usado si el cliente no envía otro.
- `STRIPE_WEBHOOK_SECRET` se obtiene al registrar el webhook de `checkout.session.completed` en Stripe apuntando a `/api/stripe-webhook`.
- `RESEND_API_KEY` habilita el envío del correo de confirmación; si se omite, el webhook no intentará mandar email.

## Desarrollo

```bash
npm install
npm run dev
```

La sección de compra se renderiza en la página principal (`src/pages/index.astro`) y apunta al endpoint `/api/checkout`. Las páginas `/compra-exitosa` y `/compra-cancelada` sirven como redirecciones de éxito y cancelación.
