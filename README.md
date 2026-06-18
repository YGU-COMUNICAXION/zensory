# Zensory

## Link del proyecto publicado

http://zensory.galimarli.com/

## Descripcion

Landing page para el curso de manifestacion con sonido de Zensory. Incluye presentacion del curso, modulos, seccion de compra, Stripe Checkout y correo de confirmacion posterior al pago.

## Tecnologias usadas

- Astro
- React
- Tailwind CSS
- Stripe Checkout
- Nodemailer
- Netlify

## Requisitos

- Node.js 18+
- npm
- Cuenta de Stripe con Price ID configurado
- Clave secreta de Stripe en variables de entorno
- Credenciales SMTP para envio de correos con Nodemailer

## Retos tecnicos

- Integrar Stripe Checkout para procesar la compra del curso.
- Confirmar sesiones pagadas antes de enviar correos de confirmacion.
- Conectar Nodemailer con SMTP para automatizar la comunicacion posterior al pago.
- Mantener paginas de exito y cancelacion para cerrar correctamente el flujo de compra.

## Creditos

Desarrollado por Jonathan Alexis Bello Lopez.
