# Plan Vitrina Express: oferta de entrada de bajo riesgo

**Estado:** diseño para revisión antes de planificación e implementación.

## Decisión comercial

El plan **Oferta clara** se reemplaza por **Plan Vitrina Express** a **$99.999 CLP**. Es la puerta de entrada para una PYME chilena que quiere invertir poco, controlar su presencia y reducir el riesgo de un proyecto web abierto.

No se vende "diseño web a medida". Se vende una vitrina profesional, lista para compartir, que muestra la información esencial antes de WhatsApp.

## Perspectiva del comprador

La oferta debe responder en el primer vistazo:

1. **¿Cuánto invierto?** Un pago único de $99.999 CLP, con adicionales separados y voluntarios.
2. **¿Qué recibo?** Una página única lista para explicar el negocio y llevar consultas a WhatsApp.
3. **¿Cuándo queda lista?** En hasta 3 días hábiles después de recibir todo el material requerido.
4. **¿Qué queda bajo mi control?** Dominio, contenido y accesos a nombre del negocio.
5. **¿Qué no se transformará en un cobro o proyecto inesperado?** La estructura, las páginas extra, los pagos en línea y el catálogo complejo quedan fuera del plan y se cotizan antes de avanzar.

## Oferta visible

### Promesa

> **Tu negocio claro y listo para compartir en 3 días hábiles.**

El plazo se muestra siempre junto a su condición: comienza cuando STAX recibe el formulario completo, textos base, fotos y la información necesaria para conectar el dominio.

### Incluye

- Una página vertical con cabecera, presentación, servicios o productos simples, preguntas frecuentes y botón a WhatsApp.
- Elección entre líneas visuales predefinidas; no incluye diseño personalizado.
- Orden de textos base, imágenes proporcionadas por el negocio y enlaces de contacto.
- Guía para que el cliente compre su dominio `.cl` en NIC Chile a su propio nombre.
- Configuración DNS y publicación conectada al dominio del cliente.
- Alojamiento inicial sin costo mensual de STAX mientras el servicio de publicación elegido mantenga su plan gratuito.
- Una ronda consolidada de cambios de texto e imágenes antes de publicar.
- Entrega de contenidos y accesos organizados para el negocio.

### No incluye

- Reuniones presenciales.
- Redacción extensa desde cero, sesión de fotos o producción audiovisual.
- Páginas adicionales, cambios de estructura o funcionalidades fuera de la página única.
- Carro de compras, pasarela de pago, reservas complejas o catálogo administrable.
- Compra del dominio, comisiones de terceros o pagos de servicios externos.

### Adicionales

- Sección adicional desde **$30.000 CLP**.
- Página adicional, redacción desde cero, catálogo amplio, reservas o pagos en línea: cotización previa según alcance.

No se inicia ningún adicional sin valor, alcance y plazo aceptados por el cliente.

## Mensajes de confianza

- **Tu dominio queda a tu nombre.** STAX guía la compra y realiza la conexión; no registra la marca del cliente.
- **Sin costo mensual de alojamiento inicial.** Se explica como condición del proveedor de publicación, sin prometer que los planes gratuitos sean permanentes.
- **Una sola ronda, un solo envío.** El cliente reúne sus cambios de texto e imágenes en una respuesta; no hay revisiones abiertas.
- **Sin sorpresas de alcance.** Cada elemento fuera del plan se presupone y aprueba antes de construirse.
- **WhatsApp, no pagos en línea.** El objetivo es hacer la primera consulta más clara; no reemplaza la operación comercial del negocio.

## Estructura en la landing

1. El primer plan de `#precios` cambia su etiqueta, precio, plazo, alcance y CTA.
2. Su tarjeta incorpora un bloque breve "Para empezar necesitas" con formulario, textos, fotos y dominio/acceso.
3. Las inclusiones y exclusiones se agrupan para que el alcance se lea antes del CTA.
4. La FAQ sobre dominio se alinea con la guía y propiedad del cliente.
5. El formulario de contacto ofrece este plan como opción por defecto y prepara el mensaje de WhatsApp con su nombre.
6. Los dos planes posteriores continúan como caminos de mayor alcance: **Atención ordenada** y **Pedidos en línea**.

## Copy orientado a bajo riesgo

- CTA principal: **Quiero mi vitrina en 3 días**.
- Etiqueta de precio: **Pago único · $99.999 CLP**.
- Apoyo: **Alcance cerrado, una ronda de cambios y dominio a tu nombre.**
- Requisito: **El plazo comienza cuando recibimos tu información completa.**

Se evita prometer ventas, consultas, conversiones o disponibilidad ilimitada del hosting gratuito.

## Restricciones y validación

- Mantener recursos locales, compatibilidad `file://`, SEO, accesibilidad, `prefers-reduced-motion` y los flujos actuales de WhatsApp.
- No alterar los planes posteriores ni las demostraciones fuera de los textos necesarios para la nueva escalera.
- Probar que CTA, formularios, mensaje de WhatsApp y selector/estado de planes mantengan el comportamiento actual.
- Añadir pruebas para precio, nombre, plazo condicionado, alcance, exclusiones, propiedad de dominio y CTA.
- Ejecutar `npm run qa:gate` antes de desplegar.
