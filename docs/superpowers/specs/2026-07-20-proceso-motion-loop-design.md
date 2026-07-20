# Motion de proceso: de la conversación a tu página

## Objetivo

Convertir los cuatro pasos del proceso en una secuencia visible que explique avance real sin convertir la sección en un carrusel ni esconder contenido.

## Comportamiento

- Mientras `#proceso` está en viewport, una sola tarjeta queda activa cada vez.
- El estado activo destaca su enumeración, borde, chip de plazo y párrafo asociado; un indicador avanza por la línea vertical de escritorio.
- Las etapas rotan en orden 1 → 2 → 3 → 4 y vuelven a 1 cada 2,6 segundos.
- Al salir del viewport o al ocultarse la pestaña, el intervalo se detiene y se elimina el estado temporal.
- Con `prefers-reduced-motion`, las cuatro etapas se muestran estáticas y no se inicia el loop.

## Restricciones y validación

- El contenido de los cuatro pasos permanece disponible y visible durante toda la secuencia.
- No se agregan dependencias, recursos externos ni cambios de CTA.
- Playwright verifica cuatro etapas, un único estado activo, avance real de la etapa, ausencia de loop bajo reducción de movimiento y comportamiento responsive sin overflow.
