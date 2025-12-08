# Zensory

Landing page de Astro para el curso de manifestación con sonido. Incluye una sección de compra integrada con Stripe Checkout y envíos de correo de confirmación posteriores al pago.

## Requisitos

- Node.js 18+
- Cuenta de Stripe con un Price ID configurado
- Clave de Resend (u otro proveedor SMTP compatible con la API HTTP de Resend) si deseas que el correo se envíe automáticamente

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las claves necesarias:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_... # sólo se usa en el cliente si quieres exponerlo

# Correo (opcional pero recomendado)
RESEND_API_KEY=re_xxx
EMAIL_FROM="Zensory <no-reply@zensory.com>"
```

- El Price ID del plan está incrustado en el código. Actualízalo en `src/components/PurchaseSection.astro` y `src/pages/api/checkout.ts` (constante `FIXED_PRICE_ID`). El ID debe existir en el mismo modo (test o live) que la clave secreta de Stripe; si usas un Price de modo live con una clave de prueba (o viceversa) Stripe responderá `No such price`.
- `RESEND_API_KEY` habilita el envío del correo de confirmación; si se omite, el pago funcionará y la página de éxito mostrará un mensaje indicando que falta configurar el proveedor de correo.

## Desarrollo

```bash
npm install
npm run dev
```

La sección de compra se renderiza en la página principal (`src/pages/index.astro`) y apunta al endpoint `/api/checkout`. Las páginas `/compra-exitosa` y `/compra-cancelada` sirven como redirecciones de éxito y cancelación.

### Flujo de correo de confirmación
1. Stripe redirige a `/compra-exitosa?session_id=...` tras un pago completado.
2. Esa página llama al endpoint `/api/confirmacion` enviando el `session_id`.
3. El endpoint valida la sesión con la clave secreta de Stripe y, si el pago está en estado `paid`, envía el correo a la dirección del comprador usando Resend (configurado con `RESEND_API_KEY` y `EMAIL_FROM`).
4. Si no configuras Resend, el pago sigue siendo válido y la página muestra que falta configurar el proveedor de correo para el envío automático.

### Cómo preparar el envío de correos
1. **Crea o verifica el dominio remitente en Resend**: en el panel de Resend añade tu dominio y publica los registros DNS (SPF y DKIM) que te indiquen. Espera a que el dominio quede verificado.
2. **Define el remitente**: usa un email del dominio verificado en `EMAIL_FROM`, por ejemplo `"Zensory <pagos@tudominio.com>"`.
3. **Obtén tu API Key**: copia la clave desde el panel de Resend y guárdala como `RESEND_API_KEY` en `.env`.
4. **Prueba en modo local**: ejecuta un pago de prueba; la página `/compra-exitosa` mostrará si el envío fue exitoso o si falta configurar el proveedor. Si recibes un error `La compra no está confirmada`, revisa que el `session_id` siga activo y que el pago esté en estado `paid`.
5. **Errores comunes**: dominio no verificado (Resend rechaza el envío) o uso de Price ID de modo distinto al de la clave (`No such price`). Revisa la consola del servidor: el endpoint `/api/checkout` devuelve el mensaje de error de Stripe para ayudarte a detectar el problema.
