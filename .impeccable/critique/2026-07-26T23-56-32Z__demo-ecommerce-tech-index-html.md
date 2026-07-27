---
target: demo-ecommerce-tech/index.html
total_score: 19
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 4
timestamp: 2026-07-26T23-56-32Z
slug: demo-ecommerce-tech-index-html
---
⚠️ DEGRADED: evaluación híbrida (Assessment A independiente; Assessment B completado en el contexto principal tras detenerse su automatización)

# Auditoría UX/UI — Apex Tech

## Salud del diseño

| # | Heurística | Puntaje | Hallazgo principal |
|---|---|---:|---|
| 1 | Visibilidad del estado | 3 | Carro, badges, tabs y pedidos actualizan su estado; guardar productos y horarios carece de confirmación. |
| 2 | Correspondencia con el mundo real | 2 | CLP, retiro y referencias chilenas aportan contexto; “pago” termina como pedido impago guardado en el navegador. |
| 3 | Control y libertad | 2 | Existen cierres y cancelación; Escape y la gestión de foco están ausentes. |
| 4 | Consistencia y estándares | 2 | La identidad es coherente; “carro/carrito”, pago/pedido y el CTA morado externo rompen continuidad. |
| 5 | Prevención de errores | 1 | Acepta teléfono inválido y cantidades superiores al stock; faltan condiciones de entrega. |
| 6 | Reconocimiento antes que memoria | 2 | Las acciones están rotuladas; el checkout omite productos, cantidades y total. |
| 7 | Flexibilidad y eficiencia | 2 | Filtros y agregado rápido funcionan; el panel móvil y el teclado pierden eficiencia. |
| 8 | Estética y minimalismo | 3 | Escritorio posee buena jerarquía; móvil alarga el recorrido y acumula colisiones. |
| 9 | Recuperación de errores | 1 | Predomina validación nativa; faltan mensajes útiles para teléfono, stock y entrega. |
| 10 | Ayuda y documentación | 1 | Existe explicación técnica, mientras el checkout y las promesas de automatización carecen de contexto operativo. |
| **Total** | | **19/40** | **Deficiente: apariencia sólida, confianza y tareas móviles requieren mejora prioritaria.** |

## Veredicto de especificidad

**Interacción con autoría; escaparate intercambiable dentro de la categoría.** La paleta azul oscuro, naranja y cian, las fotografías y el circuito catálogo → carro → pedido → panel forman una base coherente. La composición “hero tech + tres productos + explicación técnica + CTA” y el lenguaje de productos premium podrían trasladarse a otra tienda. La oportunidad distintiva está en convertir el recorrido operacional del dueño —cómo recibe y gestiona el pedido— en protagonista.

El detector encontró tres advertencias: borde lateral grueso en la pestaña activa (`index.html:796`), Inter declarado en el CTA flotante (`index.html:2101`) y halo cromático naranja (`index.html:207`). El uso local de Inter pertenece al sistema vigente; la declaración inline y los otros dos patrones sí agregan ruido evitable.

## Impresión general

El demo luce competente y el panel administrativo aporta evidencia comercial valiosa. Su mayor debilidad aparece en el momento de compromiso: promete cobro digital, abre un formulario de pedido sin pago y presenta una confirmación que parece real. En móvil, la navegación externa tapa el CTA del carro y el panel oculta columnas.

## Aciertos

- Jerarquía desktop clara y roles cromáticos consistentes: naranja para compra, cian para administración.
- Circuito interactivo completo como demostración: producto, carro, pedido y cola administrativa.
- Localización útil mediante CLP, retiro presencial primero y referencias a servicios chilenos.

## Problemas prioritarios

### [P1] El control flotante bloquea el checkout móvil

En 390×844, el CTA naranja ocupa `[25,766,341,54]` y “Volver al Showcase” ocupa `[20,776,197,48]` con `z-index:9999`; intercepta el centro del botón. La solución es retirar el duplicado o esconderlo durante overlays, conservando la navegación superior compartida.

### [P1] La promesa de pago supera la función demostrada

Metadata, hero y carro afirman pagos listos y “Continuar al Pago”; el flujo recoge contacto y entrega, guarda el pedido en `localStorage` y carece de medio de pago. Conviene presentar “Simular pedido” y reservar las pasarelas como alcance de producción claramente explicado.

### [P1] El checkout carece de resumen y barreras de seguridad

El diálogo omite productos, cantidades, total, stock, costo y plazo de entrega. Acepta `abc` como WhatsApp y permite superar el stock disponible. Debe mostrar resumen, validar teléfono chileno, limitar cantidades y explicar condiciones de despacho antes de confirmar.

### [P1] La evidencia administrativa se rompe en móvil

En 390 px, el modal mide 342 px; la tabla requiere 704 px dentro de un área útil de 274 px con contenido oculto. Conviene usar tarjetas móviles para productos y pedidos o desplazamiento horizontal deliberado con identidad y acciones accesibles.

### [P2] La página mezcla los roles de comprador y dueño

“Comprar ahora” habla al cliente; “esta demo muestra” habla al dueño; PostgreSQL/MySQL cambia hacia lenguaje técnico. Una guía explícita en tres pasos —probar como cliente, ver cómo llega el pedido y revisar qué se adapta al negocio— uniría el relato.

## Carga cognitiva y recorrido emocional

La carga es moderada: la agrupación de categorías y productos funciona, mientras el cambio constante entre comprador, dueño y proveedor tecnológico rompe el foco. El checkout exige recordar el carro. El recorrido comienza con confianza, sube al agregar productos, cae ante las promesas sin evidencia y recupera valor al mostrar el panel. El cierre ganaría tranquilidad al diferenciar claramente simulación y producción.

## Señales por persona

**Jordan, primera experiencia:** interpreta pago y chatbot como funciones disponibles; el formulario posterior cambia esa expectativa y el rol comprador/dueño queda ambiguo.

**Riley, comprador deliberado:** puede exceder stock, usar un WhatsApp inválido y detectar contradicciones entre hero, checkout y footer.

**Casey, móvil y distraído:** enfrenta 6.179 px de página, hero de 1.103 px, controles de cantidad de 28×28 px, CTA bloqueado y panel administrativo recortado.

## Observaciones menores

- La página carece de `<main>` y los overlays carecen de `role="dialog"` y `aria-modal`.
- El foco permanece detrás de los overlays; Escape carece de acción.
- Imágenes sin dimensiones, `loading` ni `decoding` explícitos.
- El hero pierde padding lateral en móvil por la combinación `.container.section-padding`.
- JSON-LD declara una tienda, dirección y teléfono ficticios; `WebPage` representaría mejor una demo.
- Las afirmaciones “Envío Express hoy”, “precios por tiempo limitado” y chatbot carecen de evidencia visible.
- `localStorage` es persistencia en el navegador, por lo que “base de datos en memoria” resulta impreciso.

## Preguntas para la siguiente iteración

- ¿Qué cambia si la historia principal pasa de “tienda tech premium” a “mira cómo un pedido llega ordenado y listo para atender”? 
- ¿Qué tres datos necesita ver un dueño chileno para confiar: stock, cobertura, despacho, medios de pago, boleta o seguimiento?
- ¿Puede el panel revelar el valor del sistema justo después de completar la simulación del pedido?
