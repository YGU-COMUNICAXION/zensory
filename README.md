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

- El Price ID del plan está incrustado en el código. Actualízalo en `src/components/PurchaseSection.astro` y `src/pages/api/checkout.ts` (constante `FIXED_PRICE_ID`). El ID debe existir en el mismo modo (test o live) que la clave secreta de Stripe; si usas un Price de modo live con una clave de prueba (o viceversa) Stripe responderá `No such price`.
- La configuración SMTP para Nodemailer está fija en `src/lib/email.ts`. Sustituye host, puerto, `user` y `pass` por los de tu proveedor SMTP.

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
1. **Configura tu servidor SMTP**: usa las credenciales de tu proveedor (Mailgun SMTP, Postmark SMTP, tu servidor corporativo, etc.). En `src/lib/email.ts` cambia `smtpConfig` con host, puerto y credenciales válidas.
2. **Ajusta remitente, branding y textos en código**: en `src/lib/email.ts` están los valores fijos (`brandName`, `brandLogoUrl`, `supportEmail`, `emailFrom` y el texto del curso). Personaliza logo, correo de soporte y remitente según tu dominio.
3. **Registra el webhook en Stripe**: en el Dashboard crea un endpoint que apunte a `/api/stripe-webhook` (o la URL pública correspondiente) y selecciona el evento `checkout.session.completed`. Copia el secreto `whsec_...` que Stripe genera y sustitúyelo en `STRIPE_WEBHOOK_SECRET` dentro del archivo.
4. **Prueba en modo local**: ejecuta un pago de prueba. Si la firma del webhook es válida y el evento es `paid`, se enviará el correo automáticamente vía SMTP. Si recibes un error `Faltan datos` o `Firma inválida`, revisa el Price ID, el secreto del webhook en el código y que estés usando el mismo modo (test/live) para todos los IDs.
5. **Errores comunes**: credenciales SMTP inválidas (el envío falla), uso de Price ID de modo distinto al de la clave (`No such price`) o webhook sin firma válida.
