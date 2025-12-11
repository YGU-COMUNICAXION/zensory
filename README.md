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
2. La página de éxito llama a `/api/confirmacion` con el `session_id`, consulta la sesión directamente en Stripe para confirmar que el estado sea `paid` y dispara el correo vía Nodemailer usando los datos capturados en el formulario (`metadata.buyer_email` y `metadata.buyer_name`).
3. Si no configuras el SMTP en `src/lib/email.ts`, el pago sigue siendo válido pero el envío de correo fallará silenciosamente; la página de éxito seguirá permitiendo el reintento manual una vez que completes la configuración.

### Cómo preparar el envío de correos
1. **Configura tu servidor SMTP**: usa las credenciales de tu proveedor (Gmail, Mailgun SMTP, Postmark SMTP, tu servidor corporativo, etc.). En `src/lib/email.ts` cambia `smtpConfig` con host, puerto y credenciales válidas (ya viene un ejemplo completo para Gmail con contraseña de aplicación).
2. **Ajusta remitente, branding y textos en código**: en `src/lib/email.ts` están los valores fijos (`brandName`, `brandLogoUrl`, `supportEmail`, `emailFrom` y el texto del curso). Personaliza logo, correo de soporte y remitente según tu dominio.
3. **Prueba en modo local**: ejecuta un pago de prueba. Si el estado de la sesión en Stripe es `paid`, `/api/confirmacion` enviará el correo automáticamente con los datos del formulario. Si recibes un error al enviar, revisa las credenciales SMTP y que el Price ID coincida con el modo (test/live) de tu clave.
4. **Configurar envío desde Gmail**:
   - Activa **verificación en dos pasos** en tu cuenta de Gmail.
   - Genera una **contraseña de aplicación** (App Password) para "Mail" → "Other".
   - En `src/lib/email.ts`, sustituye `user` por tu correo de Gmail y `pass` por la contraseña de aplicación de 16 dígitos; el host/puerto ya están listos para Gmail.
   - Ajusta `emailFrom` si quieres mostrar un nombre distinto, pero mantén el correo real en el `user` para evitar rechazos de Gmail.
5. **Errores comunes**: credenciales SMTP inválidas (el envío falla) o uso de Price ID de modo distinto al de la clave (`No such price`).
