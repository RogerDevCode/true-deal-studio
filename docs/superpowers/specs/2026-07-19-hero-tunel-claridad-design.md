# Panel de claridad para el hero de STAX

## Objetivo

Hacer visible, en el primer pantallazo, el cambio que propone STAX: una consulta sin contexto se transforma en una presencia digital que informa y prepara una conversación de WhatsApp. El panel debe transmitir criterio y control, no prometer resultados ni convertirse en entretenimiento.

## Decisión

Se reemplazará el mockup de navegador existente en el lado derecho del hero por un panel editorial llamado **Ruta de claridad**. Conserva la proporción actual del hero: propuesta y CTA a la izquierda, evidencia visual a la derecha. En móvil se presenta como una composición vertical estática y compacta.

No se incorporará React, GSAP ni recursos externos. La página ya usa HTML estático, Tailwind local y Alpine; este panel sólo requiere CSS local y un pequeño `IntersectionObserver` local para iniciar una única pasada de movimiento cuando el panel entre en el viewport.

## Experiencia y composición

El panel representa cuatro estados conectados en profundidad, de atrás hacia delante:

1. **Consulta suelta** — una burbuja breve: “¿Cuánto sale y cómo te hablo?”.
2. **Información ordenada** — chips de servicio, horario y cobertura.
3. **Página que orienta** — una mini tarjeta de negocio con oferta y acción clara.
4. **WhatsApp con contexto** — una conversación preparada que muestra comuna, servicio e intención.

Los estados avanzan levemente a través de un carril diagonal de baja intensidad, terminando en una etiqueta visible: “Listo para atender”. La animación dura aproximadamente cinco segundos, se ejecuta una vez y no depende del scroll continuo. En estado reducido o móvil, todos los estados quedan visibles sin desplazamiento.

La paleta parte del azul profundo de la marca, usa blanco para los datos legibles, verde sólo para el destino WhatsApp y rojo chileno como acento de avance. No se añade un arcoíris ni ornamentos extra: el riesgo visual está en la profundidad tipográfica y espacial del carril.

## Accesibilidad y rendimiento

- El panel tendrá una etiqueta accesible que resume la secuencia completa.
- El contenido importante existe como texto HTML; el movimiento no porta información exclusiva.
- `prefers-reduced-motion: reduce` elimina transiciones y transformaciones.
- No habrá autoplay infinito, canvas, video, fuentes remotas ni dependencia nueva.
- El foco y los CTA existentes se mantienen sin cambios.

## Validación

- Se verificará un único `h1`, metas y JSON-LD existentes de la landing.
- Playwright comprobará que el panel y sus cuatro etapas están presentes, que su clase de entrada puede activarse y que no hay desbordamiento en escritorio ni móvil.
- Se ejecutarán la prueba focalizada, `npm run qa:e2e` y `npm run qa:gate` antes de publicar.
