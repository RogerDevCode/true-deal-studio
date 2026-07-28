# Orbe FAQ en vivo para demo de fonoaudiología

## Objetivo

Incorporar en el hero de `demo-fonoaudiologia` un acceso visible y accesible a la conversación de voz ya operativa para el tenant `empresa-a` de VoiceLive. Debe orientar a las familias, responder mediante la base FAQ publicada y permitir comenzar o terminar la experiencia sin prometer una reserva ni sustituir la atención profesional.

## Alcance de esta iteración

- Botón circular de voz en el hero, con etiqueta y explicación del permiso de micrófono.
- Estado inactivo: icono de micrófono, halo de respiración lento y texto `FAQ en vivo`.
- Estado activo: barras de audio animadas, texto `Te escucho` y control para finalizar.
- Al pulsar el orbe se abre un diálogo accesible que carga el widget existente `http://localhost:5173/widget/empresa-a` en un iframe. La voz se inicia únicamente desde el control del widget; de esa forma el navegador solicita permiso mediante una acción explícita y el proyecto no duplica el cliente Gemini ya probado.
- Cierre por botón, Escape y clic fuera del panel. Al cerrar, se retira el iframe para detener audio, websocket y animación.
- Configuración local, sin dependencias ni CDN: `window.FONO_LIVE_FAQ_WIDGET_URL` permite cambiar la URL del widget. El valor por defecto es la URL local anterior.
- Si el widget no carga, el diálogo mostrará una explicación y un enlace para abrir el widget en una pestaña independiente.
- Pruebas Playwright del flujo visual, estados, diálogo, URL configurada, cierre y ausencia de errores de consola. La prueba no concede permisos reales de micrófono ni consume Gemini.

## Arquitectura

`index.html` conserva la estructura, Tailwind local y Alpine. Incluye estilos acotados `fono-live-*` y un botón en el hero. `app.js` añade un estado pequeño y aislado: `liveFaqOpen`, `liveFaqListening`, `openLiveFaq`, `closeLiveFaq` y la URL configurable. El widget VoiceLive sigue siendo el único propietario de sesión, permisos, audio y conexión Gemini; la landing solo actúa como lanzador.

El iframe permite el permiso necesario (`microphone; autoplay`) y recibe un título descriptivo. El estado `Te escucho` comunica que el panel de voz está disponible; no afirma que el micrófono ya esté capturando audio, porque la autorización ocurre dentro del widget.

## Accesibilidad y movimiento

El orbe es un botón nativo con nombre accesible y `aria-expanded`. El diálogo tiene título, descripción, botón de cierre y foco inicial en el cierre. Las ondas y halos se desactivan con `prefers-reduced-motion`. Se preserva el foco visible y la navegación por teclado.

## Fuera de alcance

- Empaquetar o dockerizar True Deal Studio.
- Duplicar el adaptador Gemini en HTML estático.
- Sincronizar directamente los estados de audio del iframe con la landing.
- Modificar la base de conocimiento, RLS, API o credenciales de VoiceLive.

## Criterios de aceptación

1. El hero muestra el orbe y la leyenda del permiso de micrófono en escritorio y móvil.
2. Pulsar el orbe abre el diálogo y cambia su presentación a activa.
3. El diálogo inserta exactamente la URL configurada y habilita micrófono/autoplay para el iframe.
4. Escape, cierre y clic en el fondo eliminan el iframe y devuelven el foco al orbe.
5. Con movimiento reducido no se ejecutan animaciones decorativas.
6. Playwright verifica el flujo y la consola queda limpia.
