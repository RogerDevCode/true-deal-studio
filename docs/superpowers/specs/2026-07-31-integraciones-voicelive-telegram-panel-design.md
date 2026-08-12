# Diseño: tarjetas de VoiceLive y Telegram en el panel

## Objetivo

Incorporar en `demo-agenda/index.html` un bloque breve de extensiones conectables a una web existente o nueva. El bloque debe despertar curiosidad mostrando dos caras del mismo sistema:

- VoiceLive: lo que vive el visitante cuando necesita orientación por voz.
- Telegram: lo que recibe y decide el dueño después de una consulta.

El primer corte se limita al panel `demo-agenda`. La landing principal podrá recibir una versión compacta cuando exista un destino público estable para Telegram.

## Contexto y decisiones

El panel ya contiene una sección comercial que explica que una web puede conectarse a sistemas sencillos de operación. Las nuevas tarjetas deben convertir esa afirmación abstracta en una evidencia visual, sin presentarlas como funciones terminadas para todos los negocios ni como reemplazo de la atención humana.

La propuesta aprobada es Telegram como centro privado del dueño. El cliente puede iniciar una consulta desde una web, WhatsApp o VoiceLive; el dueño recibe un resumen y decide el siguiente paso desde su celular.

El túnel no forma parte de la experiencia frontend. Solo podría ser una herramienta de desarrollo si un bot local necesitara exponer un webhook. Esta tarea no configura túneles, bots, webhooks, credenciales ni servicios externos.

## Experiencia y contenido

### Bloque

Ubicar el bloque después de la sección comercial existente y antes de las acciones de reinicio del panel. Usar un encabezado que conecte ambas tarjetas:

> Tu web puede orientar. Tú puedes decidir.

Texto de apoyo:

> Explora extensiones que pueden adaptarse a una web nueva o a una que ya tienes.

El bloque debe conservar la jerarquía y el lenguaje visual oscuro del panel, reutilizando tarjetas, bordes, estados de foco y tokens existentes.

### Tarjeta VoiceLive

- Etiqueta: `Atención por voz`.
- Título: `VoiceLive`.
- Copy: `Responde preguntas frecuentes por voz y orienta al visitante antes de que escriba.`
- Media: video corto de aproximadamente cinco segundos cuando el archivo esté disponible; mientras tanto, un póster o visual estático válido.
- CTA: `Probar VoiceLive`.
- Destino inicial: reutilizar el acceso VoiceLive ya presente en la landing, `https://voice.tuvitrina.lat/widget/tuvitrina`, abriendo una pestaña nueva con `rel="noopener"`.
- Disclaimers: no afirmar reservas automáticas, ventas garantizadas ni sustitución de una persona.

### Tarjeta Telegram

- Etiqueta: `Control para el dueño`.
- Título: `Tu bandeja de atención en Telegram`.
- Copy: `Recibe cada consulta resumida y decide el siguiente paso desde tu celular.`
- Media: la misma historia visual web/voz → resumen → Telegram, con énfasis en la ficha que recibe el dueño.
- CTA temporal: `Ver el flujo del dueño`.
- Destino temporal: una vista previa local accesible desde el propio panel, marcada como `Demostración conceptual`.
- Destino futuro: reemplazar la vista previa por la URL pública del proyecto Telegram cuando exista; no dejar un enlace roto ni publicar credenciales o endpoints internos.
- Acciones representadas en la vista: `Responder`, `Agendar` y `Pedir más datos`.

## Storyboard multimedia

El video o visual animado de la tarjeta Telegram cuenta en cinco segundos:

1. `0–1 s`: aparece una consulta en la web o una onda de voz de VoiceLive.
2. `1–2 s`: la consulta se ordena en servicio, comuna y horario.
3. `2–4 s`: aparece una notificación en el celular del dueño dentro de Telegram.
4. `4–5 s`: se muestran acciones para responder, agendar o pedir datos.
5. Cierre visual: `El cliente conversa. Tú mantienes el control.`

El recurso debe ser local, sin CDN ni dependencia remota. Si se implementa como video HTML, debe usar `muted`, `playsinline`, `autoplay` y `loop`, con una imagen `poster`. No debe depender del audio para comunicar la idea. Con `prefers-reduced-motion: reduce`, se muestra el póster o la versión estática sin reproducción.

No existe todavía un video local en `assets/`. Por eso el componente debe aceptar una imagen/póster como estado inicial y permitir añadir el video posteriormente sin cambiar la estructura de la tarjeta.

## Recorrido y límites funcionales

En este corte, las tarjetas son entry points comerciales y una vista previa visual. No existe integración real entre la agenda local, VoiceLive y Telegram.

El flujo representado es:

```text
Consulta web o voz
        ↓
Datos relevantes ordenados
        ↓
Resumen para el dueño en Telegram
        ↓
Responder / Agendar / Pedir datos
```

La vista previa no debe enviar mensajes, pedir permisos, guardar datos reales ni insinuar que existe una conexión productiva. Los ejemplos deben ser ficticios y claramente demostrativos.

## Accesibilidad y compatibilidad

- Mantener `lang="es-CL"`, foco visible y nombres accesibles.
- Hacer que cada CTA sea un enlace o botón nativo con texto que describa su destino.
- El video debe tener `aria-label` o texto alternativo equivalente mediante el contenido de la tarjeta y el póster.
- No reproducir audio automáticamente.
- Conservar navegación mediante `file://` y rutas relativas para la vista previa local.
- Mantener el bloque usable en móvil sin overflow horizontal.
- Respetar `prefers-reduced-motion` sin usar `!important` fuera de las excepciones existentes.

## Validación

La implementación deberá comprobar:

- Las dos tarjetas aparecen una vez y contienen el copy aprobado.
- El enlace VoiceLive conserva el destino externo y abre de forma segura.
- La tarjeta Telegram abre la vista previa local con ruta explícita.
- La vista previa comunica el flujo web/voz → Telegram y contiene sus acciones representadas.
- El recurso multimedia, si se incorpora, es local y posee `poster`, `muted`, `playsinline` y fallback estático.
- No aparecen errores de consola ni recursos remotos nuevos.
- El bloque y la vista previa funcionan en `file://` en móvil y escritorio.
- `npm run qa:gate` sigue pasando después del cambio.

## Fuera de alcance

- Crear o desplegar el bot de Telegram.
- Configurar webhook, túnel, long polling, hosting o credenciales.
- Integrar datos reales de clientes, agenda, WhatsApp o VoiceLive.
- Publicar una URL definitiva del proyecto Telegram.
- Modificar la propuesta de precios o prometer resultados comerciales.
- Rehacer la landing principal en esta primera iteración.
