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
STRIPE_WEBHOOK_SECRET=whsec_...

# Correo (opcional pero recomendado)
RESEND_API_KEY=re_xxx
EMAIL_FROM="Zensory <no-reply@zensory.com>"
# Personalización de la plantilla (opcionales)
BRAND_NAME="Zensory"
BRAND_LOGO_URL="https://placehold.co/600x200?text=Zensory"
COURSE_START_TEXT="Tu curso iniciará en la fecha indicada en tu recibo."
SUPPORT_EMAIL="soporte@ejemplo.com"
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
2. Stripe envía un webhook `checkout.session.completed` a `/api/stripe-webhook`, que valida la firma con `STRIPE_WEBHOOK_SECRET`, confirma que el pago esté en estado `paid` y dispara el correo usando Resend con la plantilla parametrizable (`src/lib/email.ts`).
3. Si el usuario necesita reenviar el comprobante, la página de éxito expone un botón que llama a `/api/confirmacion` con el `session_id` para validar la sesión y reenviar el correo manualmente.
4. Si no configuras Resend, el pago sigue siendo válido y la página de éxito mostrará un mensaje indicando que falta configurar el proveedor de correo para el envío automático.

### Cómo preparar el envío de correos
1. **Crea o verifica el dominio remitente en Resend**: en el panel de Resend añade tu dominio y publica los registros DNS (SPF y DKIM) que te indiquen. Espera a que el dominio quede verificado.
2. **Define el remitente**: usa un email del dominio verificado en `EMAIL_FROM`, por ejemplo `"Zensory <pagos@tudominio.com>"`.
3. **Personaliza la plantilla**: ajusta `BRAND_NAME`, `BRAND_LOGO_URL`, `COURSE_START_TEXT` y `SUPPORT_EMAIL` en `.env` para reutilizar la misma estructura en diferentes proyectos/marcas.
4. **Registra el webhook en Stripe**: en el Dashboard crea un endpoint que apunte a `/api/stripe-webhook` (o la URL pública correspondiente) y selecciona el evento `checkout.session.completed`. Usa la clave `whsec_...` que Stripe genera como `STRIPE_WEBHOOK_SECRET`.
5. **Prueba en modo local**: ejecuta un pago de prueba. Si la firma del webhook es válida y el evento es `paid`, se enviará el correo automáticamente. Si recibes un error `Faltan datos` o `Firma inválida`, revisa el Price ID, la clave del webhook y que estés usando el mismo modo (test/live) para todos los IDs.
6. **Errores comunes**: dominio no verificado (Resend rechaza el envío), uso de Price ID de modo distinto al de la clave (`No such price`) o webhook sin firma válida.
