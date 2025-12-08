# Zensory

Landing page de Astro para el curso de manifestación con sonido. Incluye una sección de compra integrada con Stripe Checkout y correos de confirmación posteriores al pago.

## Requisitos

- Node.js 18+
- Cuenta de Stripe con un Price ID configurado
- Clave de Resend (u otro proveedor SMTP compatible con la API HTTP de Resend) si deseas que el correo se envíe automáticamente

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las claves necesarias:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_... # sólo se usa en el cliente si quieres exponerlo

# Correo (opcional pero recomendado). Si no la defines, el envío se omite.
RESEND_API_KEY=re_xxx
```

- El Price ID del plan está incrustado en el código. Actualízalo en `src/components/PurchaseSection.astro` y `src/pages/api/checkout.ts` (constante `FIXED_PRICE_ID`). El ID debe existir en el mismo modo (test o live) que la clave secreta de Stripe; si usas un Price de modo live con una clave de prueba (o viceversa) Stripe responderá `No such price`.
- `RESEND_API_KEY` habilita el envío del correo de confirmación; si se omite, el pago funcionará y la página de éxito permitirá reenviar manualmente el comprobante si luego configuras el proveedor.

## Desarrollo

```bash
npm install
npm run dev
```

La sección de compra se renderiza en la página principal (`src/pages/index.astro`) y apunta al endpoint `/api/checkout`. Las páginas `/compra-exitosa` y `/compra-cancelada` sirven como redirecciones de éxito y cancelación.

### Flujo de correo de confirmación
1. Stripe redirige a `/compra-exitosa?session_id=...` tras un pago completado.
2. Stripe envía un webhook `checkout.session.completed` a `/api/stripe-webhook`, que valida la firma con el secreto definido en código (`STRIPE_WEBHOOK_SECRET` dentro de `src/pages/api/stripe-webhook.ts`), confirma que el pago esté en estado `paid` y dispara el correo usando Resend con la plantilla parametrizable (`src/lib/email.ts`).
3. Si el usuario necesita reenviar el comprobante, la página de éxito expone un botón que llama a `/api/confirmacion` con el `session_id` para validar la sesión y reenviar el correo manualmente.
4. Si no configuras Resend, el pago sigue siendo válido y la página de éxito mostrará un mensaje indicando que falta configurar el proveedor de correo para el envío automático.

### Cómo preparar el envío de correos
1. **Crea o verifica el dominio remitente en Resend**: en el panel de Resend añade tu dominio y publica los registros DNS (SPF y DKIM) que te indiquen. Espera a que el dominio quede verificado.
2. **Define el remitente y la plantilla en código**: en `src/lib/email.ts` están los valores fijos (`brandName`, `brandLogoUrl`, `supportEmail`, `emailFrom` y el texto del curso). Ajusta ahí el logo, el correo de soporte y el remitente que quieras usar.
3. **Registra el webhook en Stripe**: en el Dashboard crea un endpoint que apunte a `/api/stripe-webhook` (o la URL pública correspondiente) y selecciona el evento `checkout.session.completed`. Copia el secreto `whsec_...` que Stripe genera y sustitúyelo en `STRIPE_WEBHOOK_SECRET` dentro del archivo.
4. **Prueba en modo local**: ejecuta un pago de prueba. Si la firma del webhook es válida y el evento es `paid`, se enviará el correo automáticamente. Si recibes un error `Faltan datos` o `Firma inválida`, revisa el Price ID, el secreto del webhook en el código y que estés usando el mismo modo (test/live) para todos los IDs.
5. **Errores comunes**: dominio no verificado (Resend rechaza el envío), uso de Price ID de modo distinto al de la clave (`No such price`) o webhook sin firma válida.
