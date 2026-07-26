---
target: demo-salon-belleza/index.html
total_score: 15
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 4
timestamp: 2026-07-26T22-59-21Z
slug: demo-salon-belleza-index-html
---
Method: dual-agent (A: salon_design_review · B: salon_detector_evidence)

## Design Health Score

| # | Heurística | Puntaje | Hallazgo principal |
|---|---|---:|---|
| 1 | Visibilidad del estado | 2 | La selección y el total responden bien; el mensaje final presenta como solicitada una reserva que recién se prepara en WhatsApp. |
| 2 | Correspondencia con el mundo real | 2 | Precios y duraciones ayudan; términos como “visagismo”, “plex” y “reestructuración orgánica” requieren interpretación. |
| 3 | Control y libertad | 2 | Existen Cancelar y cierre; el modal carece de Escape, aislamiento de foco y retorno del foco. |
| 4 | Consistencia y estándares | 2 | La identidad visual es coherente; “Reservar”, “Agendar”, “Solicitar” y “Enviar” expresan compromisos distintos. |
| 5 | Prevención de errores | 1 | El flujo acepta cero servicios, $0 y 0 minutos; la fecha admite días pasados. |
| 6 | Reconocimiento antes que recuerdo | 2 | El resumen fijo ayuda; las biografías dependen del hover y el comparador carece de semántica de control. |
| 7 | Flexibilidad y eficiencia | n/a | Superficie Persuade; los aceleradores avanzados aportan poco al objetivo principal. |
| 8 | Estética y diseño minimalista | 3 | La composición editorial es fuerte; los controles flotantes añaden ruido y colisiones en móvil. |
| 9 | Recuperación ante errores | 1 | La validación depende de campos requeridos y una alerta general, con orientación limitada para corregir. |
| 10 | Ayuda y documentación | n/a | Superficie Persuade; la ayuda principal debe vivir dentro del recorrido de reserva. |
| **Total** |  | **15/32** | **47% · Base visual fuerte con trabajo funcional prioritario.** |

## Veredicto de especificidad

La página se siente diseñada para un salón premium. El panel editorial fijo, el negro con champagne, las tarjetas con precio y duración, el antes/después y la secuencia oferta → resultado → equipo → ubicación construyen una experiencia coherente. Esta dirección merece conservarse.

La capa verbal resulta más intercambiable: negro y dorado, “de autor”, “premium”, “exclusivo”, “pasarela” y “vanguardia” son códigos habituales de la categoría. La experiencia gana especificidad cuando muestra información observable —servicio, valor, duración, modalidad y preparación del mensaje— y la pierde cuando reemplaza evidencia por superlativos.

El detector encontró una sola advertencia `dark-glow` en `demo-salon-belleza/index.html:317`, correspondiente a una sombra dorada de hover con desplazamiento cero. La coincidencia es correcta, aunque su impacto práctico es bajo y funciona como acento intencional del lenguaje visual.

## Impresión general

Visualmente está lograda y puede generar deseo. Comercialmente, el mayor espacio de mejora está en hacer que la reserva inspire la misma confianza que la portada. El cliente entiende el estilo y los valores; al avanzar aparecen ambigüedades sobre qué está solicitando, cuánto puede variar el precio, quién atenderá y qué ocurre después de WhatsApp.

## Lo que funciona

1. **Composición editorial con personalidad.** En escritorio, el hero fijo ocupa 604,8 px y el contenido 835,2 px. La marca y la acción principal permanecen visibles mientras los servicios se revisan con calma.
2. **Oferta fácil de comparar.** Las cuatro tarjetas responden en una mirada qué servicio es, cuánto cuesta y cuánto dura. La selección alimenta un resumen persistente, una pieza comercial útil.
3. **Secuencia narrativa clara.** Servicios, resultado visual, profesionales y ubicación forman un argumento natural. En 1440×900 y 390×844 la página mantiene su ancho y los títulos se ajustan limpiamente.

## Problemas prioritarios

### [P1] La solicitud se presenta como reserva completada

**Qué ocurre:** los CTA alternan “Reservar”, “Agendar tu Cita”, “Solicitar Hora” y “Enviar Solicitud”. El formulario permite avanzar con cero servicios, total $0 y duración 0; después muestra “Reserva solicitada correctamente”, aunque la acción real consiste en abrir o preparar un mensaje de WhatsApp. La selección de Ariadna también termina serializada como “Cualquier profesional disponible”.

**Por qué importa:** el cierre define la confianza. Una clienta puede creer que obtuvo disponibilidad y profesional confirmados cuando todavía falta coordinación.

**Ajuste:** usar un modelo verbal único: “Solicitar disponibilidad” → “Preparar solicitud por WhatsApp” → “Tu solicitud quedó preparada”. Permitir una opción explícita “Quiero orientación” cuando falta servicio, mostrar tiempo estimado de respuesta y corregir el mapeo de ambas estilistas.

**Comando sugerido:** `$impeccable clarify`

### [P1] La barra móvil de conversión queda recortada y compite con otros controles

**Qué ocurre:** a 390×844, después de seleccionar un servicio, la barra mide 326 px desde x=32, mientras su CTA comienza en x=348,4 y solo conserva 50 px visibles. Comparte el borde inferior con WhatsApp y “Volver al Showcase”.

**Por qué importa:** justo cuando existe intención de compra, la acción principal pierde legibilidad y varios controles se superponen.

**Ajuste:** reducir el resumen móvil a una cifra y una acción completa —por ejemplo, “Revisar solicitud · $35.000”—, mover el detalle a una revisión desplegable y reservar una sola zona flotante libre de colisiones.

**Comando sugerido:** `$impeccable adapt`

### [P1] Las interacciones principales requieren mouse y el modal pierde aislamiento

**Qué ocurre:** las cuatro tarjetas son `div` activados por clic, el comparador es otro `div` dependiente de mouse/touch, las biografías aparecen con hover y el modal carece de `role="dialog"`, `aria-modal`, relación con su título, foco inicial, Escape y trampa de foco. Sus nueve etiquetas carecen de asociación `for`/`id`. El cierre mide 36×36 px y el botón móvil “Reservar” 110,2×38,3 px.

**Por qué importa:** teclado, lectores de pantalla y varias interacciones táctiles reciben una experiencia incompleta. El foco puede salir hacia el contenido de fondo mientras el modal sigue abierto.

**Ajuste:** convertir servicios en controles semánticos, usar un `input[type="range"]` accesible, mostrar biografías también por foco/tap y completar el patrón de diálogo con foco, Escape, restauración y objetivos mínimos de 44×44 px.

**Comando sugerido:** `$impeccable harden`

### [P1] La confianza premium depende de afirmaciones ilustrativas y precios rígidos

**Qué ocurre:** “más de 10 años”, “certificada en balayage europeo”, “academias en Londres”, estacionamiento, cafetería y una dirección específica se presentan como hechos. El antes/después afirma un resultado perfecto; los precios omiten condiciones como largo, densidad, diagnóstico, producto adicional o confirmación final.

**Por qué importa:** una demo comercial debe enseñar cómo se presenta información verificable. Credenciales ficticias o valores sin condiciones debilitan la confianza que intenta demostrar.

**Ajuste:** marcar profesionales, dirección y resultados como datos demostrativos; reemplazar superlativos por evidencia observable; presentar valores “desde” y explicar en una línea qué puede modificar el total.

**Comando sugerido:** `$impeccable clarify`

### [P2] El registro de lujo está saturado

**Qué ocurre:** “alta”, “autor”, “pasarela”, “premium”, “exclusivo” y “vanguardia” aparecen repetidamente.

**Por qué importa:** la acumulación puede sentirse sintética y desplaza información práctica para clientas chilenas que buscan confianza, precio y coordinación.

**Ajuste:** conservar dos o tres expresiones de marca y apoyar el resto del copy en resultados observables, inclusiones y logística.

**Comando sugerido:** `$impeccable distill`

## Carga cognitiva

Resultado: **moderada, 2 de 8 criterios fallidos**. La página aprueba segmentación, agrupación, jerarquía, límite de alternativas, apoyo a la memoria y revelado progresivo. Pierde foco único por la convivencia entre navegación demo, header móvil, CTA del hero, WhatsApp, botón de retorno y barra de checkout. También exige demasiadas decisiones dentro de un formulario móvil de aproximadamente 1.396 px antes de resolver servicio y disponibilidad.

## Recorrido emocional

La portada genera aspiración y las tarjetas convierten esa aspiración en información concreta. El antes/después crea el pico visual y el equipo aporta humanidad. El valle aparece en el modal: el glamour se transforma en un formulario largo, sin expectativas sobre respuesta, confirmación, variación de precio o disponibilidad. El cierre actual amplifica ese valle al comunicar éxito antes de completar la coordinación.

## Alertas por persona

**Jordan, primera visita:** distingue el estilo, aunque “Agendar”, “Reservar”, “Solicitar” y “Enviar” le hacen dudar sobre el compromiso. “Visagismo” y “plex” requieren traducción. El CTA principal abre un formulario extenso antes de elegir servicio.

**Riley, comprador deliberado:** puede elegir una fecha pasada, enviar cero servicios y seleccionar Ariadna para terminar con “Cualquier profesional”. También detectará que las credenciales, dirección y servicios complementarios parecen reales dentro de una demo.

**Casey, móvil y con interrupciones:** encuentra la barra principal recortada, tres controles en competencia y un formulario más alto que la pantalla. `autocomplete="off"` aumenta la escritura y cancelar elimina el avance.

## Observaciones menores

- Las cuatro imágenes locales suman cerca de 3 MB y cargan de inmediato; conviene priorizar hero y diferir el resto.
- El iframe de Maps carece de `title` y puede dejar un bloque oscuro amplio cuando la red demora.
- Falta una adaptación para `prefers-reduced-motion`; el efecto Ken Burns permanece activo.
- El disclaimer sobre Webpay, SII y facturación desvía el cierre de la tarea de reserva.
- El header móvil repite la marca muy cerca del hero y contiene un atributo `class` duplicado.
- El contraste muestreado fue sólido: el valor más bajo fue 5,62:1 en descripciones de servicio.

## Preguntas para desbloquear una mejor versión

- ¿Studio Chic vende lujo abstracto o la confianza de que una profesional entenderá el cabello de cada clienta?
- ¿La acción principal debe confirmar una reserva, solicitar disponibilidad o iniciar orientación?
- ¿Qué evidencia real reemplazaría mejor cada superlativo: trabajos, inclusiones, credenciales verificables, tiempos de respuesta o condiciones del precio?
