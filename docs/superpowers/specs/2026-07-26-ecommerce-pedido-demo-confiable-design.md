# Apex Tech — Pedido demo confiable

**Fecha:** 2026-07-26  
**Estado:** Aprobado mediante selección del usuario: prioridad 1 y alcance 2  
**Superficie:** `demo-ecommerce-tech/index.html`

## Objetivo

Convertir el recorrido de Apex Tech en una demostración comercial honesta y completa: la persona prueba el catálogo como cliente, crea un pedido demostrativo y luego puede revisar cómo aparece en el panel del negocio.

La mejora conserva la identidad visual vigente y resuelve los cuatro problemas P1 detectados en la auditoría.

## Alcance aprobado

1. Evitar que la navegación flotante interfiera con el carro, checkout o panel.
2. Diferenciar de forma explícita la simulación actual y las integraciones disponibles en una publicación real.
3. Incorporar contexto, validación y límites de inventario en el checkout.
4. Presentar productos y pedidos del panel administrativo en un formato legible en móvil.

Quedan fuera de este ciclo los refinamientos estéticos P2/P3 que carecen de impacto directo sobre estos cuatro problemas.

## Dirección comercial

### Relato principal

La página guiará al dueño de una PYME mediante tres momentos observables:

1. **Prueba el catálogo como cliente.**
2. **Crea un pedido demostrativo.**
3. **Revisa cómo llega al panel del negocio.**

El hero conserva la idea de una vitrina activa, expresada como:

> Tu catálogo también puede ordenar pedidos.

La bajada explicará que catálogo, carro, pedido y panel son interactivos, mientras pagos, despacho y automatizaciones se conectan al publicar según el alcance acordado.

### Lenguaje del flujo

- Hero: **Probar catálogo**.
- Producto: **Agregar al carro**.
- Carro: **Revisar pedido demo**.
- Checkout: **Crear pedido demo**.
- Éxito: **Pedido demo creado**.
- Panel: **Ver pedido en el panel**.

Cada etapa indicará que se trata de una simulación y que cualquier información ingresada permanece en el navegador utilizado para la demostración.

## Veracidad y alcance

- Metadata y datos estructurados describirán una `WebPage` demostrativa.
- Se retirarán afirmaciones sin evidencia visible: pagos listos, chatbot disponible, envío express hoy y ofertas por tiempo limitado.
- Las pasarelas, logística, facturación y automatizaciones se explicarán como integraciones de producción sujetas a revisión técnica y requisitos del proveedor.
- El texto evitará prometer que la operación desaparece; destacará que el sistema ayuda a recibir información ordenada y mantener control.

## Inventario

- Cada tarjeta mostrará unidades disponibles.
- Agregar e incrementar respetará `product.stock`.
- Al alcanzar el máximo se comunicará **Stock máximo agregado** mediante una región `aria-live`.
- Los botones de agregar quedarán deshabilitados cuando el producto esté inactivo, agotado o completamente agregado.
- El carro mostrará cantidad actual y máximo disponible.

## Checkout

Antes del formulario se mostrará:

- Productos y cantidades.
- Subtotal de productos.
- Modalidad elegida.
- Condición de entrega:
  - Retiro presencial demostrativo: sin costo de despacho.
  - Despacho: cobertura, valor y plazo por confirmar.
- Total de productos, separado de cualquier costo de despacho pendiente.

Validaciones:

- Nombre requerido.
- WhatsApp chileno con 9 dígitos después de `+56`, aceptando espacios.
- Dirección requerida cuando se elija despacho.
- Mensajes afirmativos y específicos dentro de una región `aria-live`.

El formulario conservará **Presencial** primero y seleccionado por defecto.

## Resultado y panel

Al crear el pedido:

- El carro se vacía.
- Se abre una confirmación claramente demostrativa.
- La acción principal abre el panel en la pestaña Pedidos.
- El pedido nuevo queda visible durante la experiencia.
- Cerrar la confirmación restablece su estado.

En móvil, las tablas de Productos y Pedidos se reemplazarán visualmente por tarjetas con los mismos datos y acciones. En escritorio se conservarán las tablas actuales.

## Navegación y overlays

- Se retirará el botón flotante morado duplicado; la navegación STAX superior seguirá disponible.
- Carro, checkout, confirmación, panel y editor de producto usarán semántica de diálogo.
- Escape cerrará la capa activa.
- El foco entrará en el overlay y volverá al control de origen al cerrar.
- El fondo quedará inerte mientras exista un diálogo activo.
- Los controles táctiles principales medirán al menos 44×44 px.

## Rendimiento y compatibilidad

- Recursos locales y Alpine.js vigente.
- Compatibilidad `file://`.
- Hero con prioridad de carga y dimensiones explícitas.
- Imágenes de productos con dimensiones, `loading="lazy"` y `decoding="async"`.
- Movimiento respetuoso de `prefers-reduced-motion`.

## Pruebas de aceptación

1. El texto diferencia simulación y producción en hero, carro, checkout y confirmación.
2. El carro respeta el stock y anuncia el límite.
3. El checkout muestra resumen, total y condición de entrega.
4. Un WhatsApp inválido produce orientación específica.
5. Presencial permanece primero y seleccionado.
6. El pedido creado aparece en el panel durante la sesión.
7. Las tarjetas administrativas son legibles en 390×844.
8. La navegación STAX permanece disponible y libre de superposición.
9. Escape, foco y restauración funcionan en los overlays.
10. La página mantiene SEO, recursos locales y navegación `file://` válidos.

## Riesgos controlados

- Los datos y nombres existentes se presentan como ilustrativos.
- Las integraciones comerciales se describen como alcance configurable.
- La implementación reutiliza el estado Alpine y el diseño existente, evitando dependencias y reestructuraciones ajenas a los P1.
