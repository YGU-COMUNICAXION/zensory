# Zensory

Landing page de Astro para el curso de manifestación con sonido. Incluye una sección de compra integrada con Stripe Checkout y correos de confirmación posteriores al pago.

## Requisitos

- Node.js 18+
- Cuenta de Stripe con un Price ID configurado
- Acceso SMTP para el envío de correos con Nodemailer (se configura directamente en el código)

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las claves necesarias:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_... # sólo se usa en el cliente si quieres exponerlo
```

- El Price ID está incrustado en el código. Actualízalo en `src/components/PurchaseSection.astro` y `src/pages/api/checkout.ts` (propiedad `id` de `FIXED_PRICE`). El ID debe existir en el mismo modo (test o live) que la clave secreta de Stripe; si usas un Price de modo live con una clave de prueba (o viceversa) Stripe responderá `No such price`.
- La configuración SMTP para Nodemailer está fija en `src/lib/email.ts`. Trae un ejemplo listo para Gmail con contraseña de aplicación (host `smtp.gmail.com`, puerto 465, `secure: true`). Sustituye `user` y `pass` por tu correo de Gmail y la contraseña de aplicación de 16 dígitos.

## Desarrollo

```bash
npm install
npm run dev
```

La sección de compra se renderiza en la página principal (`src/pages/index.astro`) y apunta al endpoint `/api/checkout`. Las páginas `/compra-exitosa` y `/compra-cancelada` sirven como redirecciones de éxito y cancelación.

### Flujo de correo de confirmación
1. Stripe redirige a `/compra-exitosa?session_id=...` tras un pago completado.
2. Stripe envía un webhook `checkout.session.completed` a `/api/stripe-webhook`, que valida la firma con el secreto definido en código (`STRIPE_WEBHOOK_SECRET` dentro de `src/pages/api/stripe-webhook.ts`), confirma que el pago esté en estado `paid` y dispara el correo usando Nodemailer con la plantilla parametrizable (`src/lib/email.ts`).
3. Si el usuario necesita reenviar el comprobante, la página de éxito expone un botón que llama a `/api/confirmacion` con el `session_id` para validar la sesión y reenviar el correo manualmente.
4. Si no configuras el SMTP en `src/lib/email.ts`, el pago sigue siendo válido pero el envío de correo fallará silenciosamente; la página de éxito seguirá permitiendo el reintento manual una vez que completes la configuración.

### Cómo preparar el envío de correos
1. **Configura tu servidor SMTP**: usa las credenciales de tu proveedor (Gmail, Mailgun SMTP, Postmark SMTP, tu servidor corporativo, etc.). En `src/lib/email.ts` cambia `smtpConfig` con host, puerto y credenciales válidas (ya viene un ejemplo completo para Gmail con contraseña de aplicación).
2. **Ajusta remitente, branding y textos en código**: en `src/lib/email.ts` están los valores fijos (`brandName`, `brandLogoUrl`, `supportEmail`, `emailFrom` y el texto del curso). Personaliza logo, correo de soporte y remitente según tu dominio.
3. **Registra el webhook en Stripe** (personalizado dentro del proyecto):
   - Ve a **Developers → Webhooks → Add endpoint**.
   - URL: tu dominio público + `/api/stripe-webhook` (en local, usa Stripe CLI: `stripe listen --forward-to localhost:4321/api/stripe-webhook`).
   - Eventos: marca **`checkout.session.completed`**.
   - Copia el secreto `whsec_...` que Stripe genera y pégalo en la constante `STRIPE_WEBHOOK_SECRET` de `src/pages/api/stripe-webhook.ts`.
4. **Prueba en modo local**: ejecuta un pago de prueba. Si la firma del webhook es válida y el evento es `paid`, se enviará el correo automáticamente vía SMTP. Si recibes un error `Faltan datos` o `Firma inválida`, revisa el Price ID, el secreto del webhook en el código y que estés usando el mismo modo (test/live) para todos los IDs.
5. **Configurar envío desde Gmail**:
   - Activa **verificación en dos pasos** en tu cuenta de Gmail.
   - Genera una **contraseña de aplicación** (App Password) para "Mail" → "Other".
   - En `src/lib/email.ts`, sustituye `user` por tu correo de Gmail y `pass` por la contraseña de aplicación de 16 dígitos; el host/puerto ya están listos para Gmail.
   - Ajusta `emailFrom` si quieres mostrar un nombre distinto, pero mantén el correo real en el `user` para evitar rechazos de Gmail.
6. **Errores comunes**: credenciales SMTP inválidas (el envío falla), uso de Price ID de modo distinto al de la clave (`No such price`) o webhook sin firma válida.
