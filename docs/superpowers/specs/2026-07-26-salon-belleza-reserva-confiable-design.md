# Studio Chic — Reserva confiable y propuesta comercial

## Contexto y objetivo

La demo de Studio Chic ya posee una dirección visual premium reconocible. Esta mejora conserva su composición editorial, paleta negro/champagne, fotografía y secuencia de contenido, mientras alinea la reserva, la accesibilidad y la evidencia comercial con una experiencia tranquila para clientas chilenas y viable para una PYME de salón.

El objetivo principal es que una visitante pueda entender qué servicio busca, revisar un valor referencial, pedir orientación cuando todavía está decidiendo y preparar una solicitud por WhatsApp con expectativas claras sobre confirmación.

## Criterio de decisión

Dos perfiles especializados resolvieron las preguntas de producto:

- **PYME chilena en el contexto de salones de belleza:** prioriza disponibilidad real, valores referenciales, prevención de dobles reservas, formulario breve y datos verificables.
- **Mujer Chile que quiere verse hermosa:** prioriza inspiración con control, orientación sin presión, claridad de precio, confianza en la profesional y un recorrido móvil cómodo.

La experiencia buscada es: **“Aquí pueden entender lo que quiero, puedo revisar cuánto cuesta y sé cómo avanzar con calma.”**

## Elementos que se conservan

- Titular: “Tu cabello habla de ti. Dale voz.”
- Composición dividida con hero fijo en escritorio.
- Paleta negro, champagne y dorado.
- Fuentes locales Outfit e Inter.
- Fotografía principal y numeración editorial.
- Tarjetas de servicio con selección dorada.
- Comparador antes/después.
- Secciones servicios → resultado → profesionales → ubicación.
- Recursos locales, Alpine.js y compatibilidad `file://`.

## Promesa y acciones

Toda la página usará una jerarquía verbal única:

- CTA principal: **“Solicitar disponibilidad”**.
- CTA secundario del hero: **“Ver servicios y valores”**.
- CTA de orientación: **“Quiero orientación”**.
- Acción final: **“Preparar solicitud por WhatsApp”**.
- Confirmación: **“Tu solicitud quedó preparada en WhatsApp. Revísala y envíala para coordinar.”**

La página aclarará que el horario, la profesional y el valor final quedan confirmados cuando el salón responde por WhatsApp.

## Hero

- Badge: “Corte, color y cuidado capilar”.
- Titular actual conservado.
- Bajada: “Elige un servicio o cuéntanos qué cambio buscas. Revisamos tu cabello, el tiempo necesario y la disponibilidad antes de confirmar la hora por WhatsApp.”
- CTA principal abre la solicitud con orientación como intención inicial.
- CTA secundario lleva a servicios.

## Servicios y valores

Las tarjetas serán controles semánticos con `aria-pressed`, teclado y foco visible. Cada valor aparecerá como “Desde $…”.

Copy:

- **Corte de autor:** “Corte personalizado según la forma de tu rostro, tu tipo de cabello y el estilo que buscas. Incluye lavado y peinado final.”
- **Balayage champagne:** “Iluminación personalizada en tonos arena o champagne, con protección para la fibra capilar durante el proceso.”
- **Reconstrucción capilar:** “Tratamiento intensivo para cabello seco, poroso o sensibilizado, elegido según su estado actual.”
- **Peinado de evento:** “Ondas, recogidos o acabado pulido para matrimonios, graduaciones y otras ocasiones especiales.”

Nota visible:

> Valores referenciales. El total puede variar según largo, densidad, estado del cabello, técnica y productos requeridos. El salón confirma el valor antes de agendar.

Se añadirá una alternativa visible para pedir orientación sin seleccionar un servicio. El estado jamás mostrará “Ninguno”, $0 o 0 minutos como solicitud comercial.

## Barra móvil y controles flotantes

En móvil, la barra seleccionada mostrará una sola acción legible:

- Un servicio: “Revisar solicitud · $35.000 estimado”.
- Varios: “Revisar 2 servicios · $120.000 estimado”.
- Orientación: “Revisar solicitud de orientación”.

Mientras esta barra o el modal estén visibles, WhatsApp flotante se ocultará. El retorno al showcase inferior se retirará porque la barra superior compartida ya ofrece navegación. La acción tendrá un mínimo táctil de 44×44 px y respetará el ancho completo del viewport.

## Comparador y evidencia visual

El comparador se implementará con `input type="range"`, nombre accesible, teclado, toque y valores 0–100.

Copy:

> Mueve el control para comparar una referencia visual. En el sitio publicado, esta galería puede mostrar trabajos reales autorizados por cada clienta.

Etiqueta: “Ejemplo visual demostrativo”.

## Profesionales

Los perfiles se presentarán como demostrativos. La información ampliada permanecerá disponible mediante hover, foco y toque; en móvil será visible sin depender del hover.

Copy de transparencia:

> Perfiles ilustrativos. En una publicación real, este espacio presenta nombres, experiencia, formación y trabajos verificables.

El formulario utilizará preferencias, jamás asignaciones automáticas:

- “Sin preferencia: recomiéndenme según lo que busco”.
- Valentina Moretti.
- Ariadna Ruiz.

Ambas profesionales se serializarán correctamente en el mensaje. La preferencia quedará sujeta a disponibilidad.

## Ubicación y carácter demostrativo

La página se identificará de forma discreta como “Demo interactiva · contenido ilustrativo”. Profesionales, galería, valores y ubicación se presentarán como ejemplos.

La sección de ubicación dirá:

> Ubicación demostrativa. En una publicación real, aquí aparecen dirección, horarios, estacionamiento y servicios confirmados por el salón.

El JSON-LD cambiará de `BeautySalon` ficticio a `WebPage` demostrativa, sin dirección ni teléfono interpretables como negocio real. El iframe llevará `title`.

El footer reemplazará el disclaimer de Webpay/SII por:

> Esta demostración utiliza nombres, imágenes, valores y ubicación ilustrativos. Al publicar, cada dato se reemplaza por información revisada con el salón.

## Formulario de solicitud

Título: “Solicitar disponibilidad”.

Introducción:

> Cuéntanos qué te gustaría hacerte y cuándo te acomoda. Prepararemos tu mensaje para WhatsApp; el salón confirmará horario y valor final.

Campos:

- Nombre, obligatorio, `autocomplete="name"`.
- WhatsApp, obligatorio, `autocomplete="tel"`.
- Servicio(s) seleccionado(s) o “Quiero orientación”.
- Profesional de preferencia, opcional.
- Fecha preferida, obligatoria y desde hoy.
- Hora preferida, obligatoria.
- Presencial como modalidad única de esta demo.
- “Cuéntanos sobre tu cabello y el resultado que buscas”, opcional.

El correo y diagnóstico online se retirarán para reducir fricción y alcance operativo. Se añadirá privacidad con enlace `../privacidad.html` y la ayuda:

> También puedes adjuntar una foto de tu cabello o una referencia cuando se abra WhatsApp.

Los errores aparecerán junto al origen y en una región `aria-live`. La solicitud con orientación será válida; cualquier otro envío requiere al menos un servicio.

## WhatsApp y estado

El mensaje será:

```text
Hola, Studio Chic. Quiero consultar disponibilidad.

Nombre: …
Servicio(s): …
Valor referencial: …
Fecha preferida: …
Hora preferida: …
Profesional de preferencia: …
Modalidad: Presencial
Sobre mi cabello y lo que busco: …

Entiendo que el horario y el valor final se confirman por este medio.
```

Los campos opcionales vacíos usarán “Por conversar”. Se conservará el fallback de WhatsApp. La demo evitará guardar datos personales en `localStorage`; el estado será transitorio y se restablecerá al cancelar, cerrar o preparar la solicitud.

## Modal y accesibilidad

- `role="dialog"`, `aria-modal="true"` y título asociado.
- Foco inicial en el primer campo.
- Escape cierra y restablece.
- Tab y Shift+Tab permanecen dentro del modal.
- El foco regresa al control que abrió el modal.
- Labels conectados mediante `for` e `id`.
- Botón de cierre y acciones con mínimo 44×44 px.
- Controles de fondo sin interacción mientras el modal está abierto.
- Acciones accesibles al final del scroll dentro del modal.

## Rendimiento y movimiento

- Hero con prioridad alta y dimensiones explícitas.
- Galería y profesionales con dimensiones, `loading="lazy"` y `decoding="async"`.
- `prefers-reduced-motion` detendrá Ken Burns y reducirá transiciones.
- Se eliminará el halo dorado de desplazamiento cero, conservando profundidad mediante sombra oscura con offset y borde champagne.
- Se corregirá el atributo `class` duplicado del CTA móvil.

## Validación

Las pruebas automatizadas cubrirán:

- CTA y copy unificados.
- Tarjetas semánticas, selección por teclado y barra móvil dentro del viewport.
- Orientación válida y ausencia de totales $0/0 minutos.
- Comparador operable con rango.
- Perfiles disponibles en móvil/foco.
- Modal accesible, foco contenido, Escape y restauración.
- Labels, fecha mínima, errores y privacidad.
- Profesional correcta en WhatsApp.
- Mensaje consultivo y estado preparado.
- Restablecimiento de formulario y selección.
- Datos demostrativos, JSON-LD y recursos locales.
- Movimiento reducido, imágenes diferidas, consola y navegación `file://`.

