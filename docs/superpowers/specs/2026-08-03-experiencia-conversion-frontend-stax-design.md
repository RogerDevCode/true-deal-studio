# Experiencia de conversión frontend STAX — Diseño aprobado

**Fecha:** 3 de agosto de 2026  
**Estado:** Aprobado para especificación; espera revisión final antes del plan ejecutable.  
**Ámbito:** `true-deal-studio`, `voicelive-v2` y `venta-max-ia` como una oferta, con despliegues y datos separados.

## 1. Resultado buscado

STAX debe causar comprensión y curiosidad antes de explicar tecnología. Una persona dueña de una MIPYME/PYME debe
poder ver en menos de diez segundos cómo una consulta recibe orientación y cómo esa atención llega más ordenada al
negocio. La página no promete ventas automáticas ni reemplaza la decisión humana.

La secuencia comercial queda así:

```text
Micro-video subtitulado → probar voz → elegir rubro → explorar demo diferenciada
→ pedir orientación → WhatsApp con contexto → continuidad humana por Telegram
```

La promesa visible conserva:

> La web explica. La voz orienta. Tú decides el siguiente paso.

## 2. Hallazgos que orientan el diseño

- La VIII Encuesta de Microemprendimiento registra cerca de dos millones de personas microemprendedoras en Chile;
  86,8 % trabaja por cuenta propia, 49,4 % inició por necesidad y la ganancia mediana declarada fue $400.000.
  El diseño debe ahorrar tiempo, evitar aprendizaje técnico y dejar claro el valor antes de pedir datos.
- La radiografía Sercotec 2021 es histórica, no una proyección actual, pero indica una brecha útil: 72 % declaró
  ventas por redes sociales frente a 29 % por página web y 23 % expresó falta de conocimiento para decidir sobre
  digitalización. El programa vigente Negocios Digitales mantiene el foco en primera digitalización y expansión de
  canales. STAX debe explicar con evidencia concreta, no con jerga.
- En salud chilena, el trato digno exige lenguaje claro y adecuado. Las demos de salud, infancia y cuidado deben
  hablar de atención, acompañamiento, familias y profesionales; no describir la relación con un niño como negocio.

Fuentes de referencia:

- [VIII Encuesta de Microemprendimiento, INE](https://www.ine.gob.cl/sala-de-prensa/prensa/general/noticia/2025/12/10/en-chile-hay-cerca-de-2-millones-de-personas-microemprendedoras)
- [Radiografía de la MIPE, Sercotec](https://explorador.sercotec.cl/wp-content/uploads/2023/05/Radiografia-de-la-Situacion-Actal-de-la-Mipe-en-Chile-2021.pdf)
- [Programa Negocios Digitales, Sercotec](https://www.sercotec.cl/programas/negocios-digitales-2025/)
- [Trato digno y lenguaje adecuado, Superintendencia de Salud](https://www.superdesalud.gob.cl/preguntas-frecuentes/cuales-son-los-derechos-de-las-personas-respecto-del-trato-que-reciben-de-los-prestadores-de-salud/)

## 3. Decisiones de diseño

### 3.1 STAX Web: voice-first con prueba guiada

El hero de `index.html` cambia la jerarquía, no la promesa:

1. Titular de dos líneas: “Que te vean. Que te crean.”
2. Bajada: “Tu web puede orientar antes de que te escriban.”
3. Módulo principal de evidencia: mini-video de 15–20 segundos, subtitulado, sin audio automático, con poster.
4. Acción principal: **“Habla ahora con la demo”**. Abre VoiceLive con contexto de demostración.
5. Acción secundaria: **“Ver un ejemplo de mi rubro”**. Lleva a ejemplos, no a una matriz de herramientas.
6. Texto breve que explica el resultado: una consulta se ordena para que el dueño decida el siguiente paso.

El video ilustra una única secuencia reconocible: pregunta natural → orientación → ficha o mensaje ordenado para el
negocio. No muestra testimonios ficticios, ventas inventadas ni cifras de conversión sin evidencia.

### 3.2 Medios: impacto sin saturación

- Un video principal por landing, no fondos de video repetidos.
- Cada demo mantiene una imagen hero contextual; solo incorpora micro-video si explica una interacción difícil de
  imaginar (voz, agenda o pedido).
- Video en silencio por defecto, con controles, subtítulos, poster, carga diferida y equivalente estático.
- No usar carruseles automáticos, autoplay con sonido, loops decorativos ni más de una animación competitiva por
  bloque visible.
- Respetar `prefers-reduced-motion`, navegación por teclado, texto alternativo y presupuesto de carga móvil.
- Recursos visuales locales siempre que la página deba seguir operando mediante `file://`.

### 3.3 Demos: umbral de identidad explícito

Cada demo recibe una franja superior persistente, distinta de su cabecera comercial propia:

```text
DEMO STAX · [TIPO DE ATENCIÓN O SERVICIO]                 ← Volver a STAX
```

La franja debe:

- aparecer antes de la identidad simulada;
- explicar que se está viendo una experiencia de referencia;
- conservar un regreso explícito a STAX;
- usar una estética STAX separada de los colores/brand del demo;
- no repetir el hero, navegación ni CTA de STAX dentro de la demo.

En Fonoaudiología, la cabecera del ejemplo se organiza así:

```text
Nahovy Gallegos
Fonoaudiología
```

“Fonoaudiología” es texto secundario, no otro titular competidor. La primera frase de la demo habla de orientación
para la familia y atención profesional, nunca de negocio.

En Belleza, el umbral usa “Atención y reservas”; la identidad secundaria puede decir “Belleza y cuidado personal”.

### 3.4 Lenguaje según la relación, no solo según la industria

| Contexto | Lenguaje recomendado | Evitar en experiencia pública |
| --- | --- | --- |
| STAX conversando con un dueño | negocio, operación, atención, clientes | tecnicismos sin resultado visible |
| Salud, infancia y cuidado | atención, acompañamiento, familia, profesional, orientación | negocio cuando alude a niños, pacientes o cuidado |
| Belleza y bienestar | experiencia, servicio, reserva, salón, equipo | negocio como descripción fría de la relación personal |
| Comercio | tienda, local, catálogo, pedido, emprendimiento | frases ambiguas sobre stock o precio |
| Servicios profesionales | atención profesional, consulta, proyecto, coordinación | promesas de resultado garantizado |

Esta regla se revisa en títulos, CTA, barras de demo, mensajes de vacío, formularios, tooltips, audio y FAQ visibles.

### 3.5 VoiceLive público

El widget debe cargar la marca y contexto real del tenant antes de formular el primer encabezado. No presenta el
slug técnico como identidad pública. Su inicio se ordena así:

1. Marca/logo y nombre del profesional, salón, tienda u organización.
2. Una frase de propósito por rubro.
3. Una pregunta inicial simple o ejemplo de pregunta.
4. Consentimiento claro y proporcional.
5. Nombre/WhatsApp sugeridos, no bloqueantes para una primera conversación.

El visitante entiende que puede probar sin datos, pero se le explicará de forma amable que WhatsApp o correo serán
necesarios cuando pida buscar, crear, cambiar o cancelar una hora. Si el canal externo falla, la interfaz muestra
un mensaje comprensible y una salida alternativa; no deja un widget vacío ni promete atención inmediata.

### 3.6 Panel tenant de VoiceLive

El panel actual no elimina capacidades, pero reordena la primera experiencia mediante una vista **Hoy**:

- solicitudes nuevas;
- reservas pendientes de confirmación;
- conflictos o errores de Google Calendar;
- FAQ sin publicar o brechas de respuesta;
- acción rápida contextual: revisar, reservar manualmente, responder por WhatsApp, completar horario o probar chat.

La navegación conserva todas las áreas, pero agrupa configuración avanzada y muestra progresivamente las acciones
según el estado del tenant. Un owner no necesita recorrer diez pestañas para saber qué atender.

### 3.7 VentaMax IA

VentaMax IA es un centro de continuidad operativa, no la página comercial de entrada. Su interfaz destaca primero:

1. conversaciones nuevas y sin respuesta;
2. pedidos que requieren acción;
3. cambios de pipeline o handoff;
4. estado de Telegram;
5. acceso a catálogo y agente como preparación, no como primer deber del día.

Bandeja, Pedidos y pendientes quedan visibles como tareas de jornada. Agente, Laboratorio, Analytics y Configuración
permanecen accesibles, pero no compiten con la atención real. WhatsApp no se presenta como activo mientras siga
deshabilitado.

## 4. Fronteras de implementación

- La landing no almacena agenda, pedidos ni conversaciones.
- VoiceLive mantiene agenda, solicitudes, memoria consentida y FAQ como fuentes de verdad.
- VentaMax IA mantiene conversaciones Telegram, catálogo, pipeline y pedidos como fuentes de verdad.
- Google Calendar sigue siendo una proyección de salida de VoiceLive.
- No fusionar contenedores, credenciales, bases de datos ni imágenes de los tres repositorios.
- Cambios de enlace o payload transversal declaran URL, autenticación, responsable, error y prueba de extremo a
  extremo antes de implementarse.

## 5. Mandato independiente del red team

El red team toma `docs/sugerencias-promocion.md` como insumo, pero no copia sus propuestas sin verificar impacto,
alcance y coherencia con el código. Produce un plan separado y crítico para el frontend del megaproyecto.

El plan debe contener:

1. Auditoría de mensaje, jerarquía, CTA, semántica, accesibilidad, rendimiento y móvil en los tres frontends.
2. Un inventario de medios existentes y propuestos: objetivo, ubicación, peso, poster, subtítulos, fallback y prueba.
3. Reglas para identificar que el usuario dejó STAX y entró a una demo, incluso con navegación atrás/adelante,
   `file://`, pantalla pequeña, modo claro/oscuro y JavaScript reducido.
4. Pruebas de comprensión de diez segundos con criterios verificables, no solo opiniones de diseño.
5. Pruebas de caída de widget, túnel y video; la conversión conserva una acción de recuperación.
6. Revisión de lenguaje sensible por rubro y bloqueo explícito de palabras impropias en superficie pública.
7. Validación de paneles internos con escenarios “qué reviso hoy” y permisos owner/operator.
8. Eventos de analítica mínimos y respetuosos: reproducción iniciada/completada, apertura de demo de voz,
   selección de rubro, llegada a demo, inicio de orientación y preparación de contacto. No registrar audio ni datos
   sensibles innecesarios.
9. Criterios de rechazo: saturación visual, CTA ambiguo, prueba que solo comprueba presencia de elementos,
   métricas ficticias, degradación de accesibilidad o aumento no justificado del peso inicial.

## 6. Criterios de aceptación

- En diez segundos, una persona puede identificar qué hace STAX, ver la evidencia y probar la voz.
- El hero funciona sin video, JavaScript, audio automático o un túnel externo disponible.
- Cada demo comunica de forma inequívoca que es una experiencia STAX de referencia y que tiene identidad propia.
- Fonoaudiología y Belleza no usan “negocio” de forma fría o impropia en copy público.
- El widget VoiceLive no muestra un slug técnico como nombre inicial y deja probar sin nombre/WhatsApp.
- El panel VoiceLive permite identificar la prioridad del día sin abrir todas sus pestañas.
- VentaMax IA permite ver conversaciones/pedidos pendientes sin que los ajustes compitan por atención.
- Las nuevas imágenes y videos tienen propósito, alternativa, presupuesto de carga y prueba automatizada.
- Todas las pruebas existentes se mantienen o se fortalecen; ninguna se relaja para aprobar el cambio.
