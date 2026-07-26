# Plan de cambios — Primeras 3 secciones STAX

> **Para agentes de implementación:** ejecutar este plan por tareas, con pruebas Playwright antes y después de cada cambio. No sobrescribir cambios locales preexistentes en `index.html`.

**Objetivo:** lograr que un dueño de mipyme chilena entienda en `#inicio`, `#necesidades` y `#demos` qué hace STAX y por qué le sirve, usando lenguaje cotidiano y sin ampliar la promesa hacia IA, bots o automatizaciones.

**Arquitectura:** la landing continúa como HTML estático en `index.html`, con Tailwind compilado y Alpine.js locales. Se conserva el simulador interactivo del Hero y la expansión existente de tres a diez tarjetas; el trabajo se concentra en jerarquía, copy, contratos Playwright y consistencia SEO.

**Stack:** HTML5, CSS y Alpine.js locales, Node.js `>=22 <23`, Playwright y navegación compatible con `file://`.

## Restricciones globales

- Mantener STAX como marca pública y True Deal Studio como nombre del repositorio.
- Mantener `lang="es-CL"`, un solo `<h1>`, rutas relativas explícitas y funcionamiento offline.
- No agregar CDN, fuentes remotas, dependencias, React ni servicios externos.
- Conservar el simulador actual de seis rubros en el Hero; no recuperar `.clarity-tunnel`.
- Conservar tres tarjetas visibles inicialmente y las diez accesibles mediante el control `showAllDemos`.
- No alterar los enlaces ni el comportamiento interno de las 14 demostraciones del repositorio.
- No prometer ventas, conversiones, reducción cuantificada de mensajes ni resultados de clientes inexistentes.
- No promocionar Telegram, Voice Live, chatbots o automatización en estas tres secciones.
- Preservar los cambios locales existentes en `index.html`; antes de implementar se debe identificar su autoría y estado.
- La tarea termina con `npm run test_root`, la prueba focalizada de landing y `npm run qa:gate` en `PASS`.

## Resumen ejecutivo (3-4 líneas)

El análisis anterior sí corresponde a STAX, pero su recomendación sobre reducir las demos ya estaba implementada: la landing muestra tres tarjetas y permite expandir diez. [dato] El plan actualizado conserva ese comportamiento y también conserva el simulador de rubros incorporado por el commit más reciente del Hero. [dato] Los cambios se concentran en nombrar “páginas web” desde el primer bloque, simplificar Necesidades y volver las tarjetas más concretas sin eliminar la evidencia de criterio exigida por el proyecto. [supuesto] El efecto comercial deberá verificarse con comprensión observada y eventos reales; no se presenta como garantía.

## Hallazgos del Paso 1 (investigación)

### Evidencia externa aplicable

- [dato] La Estrategia de Digitalización de Mipymes 2025 del Ministerio de Economía usa más de 40.000 diagnósticos del Chequeo Digital realizados entre 2021 y 2024 y pide lenguaje claro, navegación simple y apoyo visual para personas con bajo dominio tecnológico. [Fuente: Ministerio de Economía](https://www.economia.gob.cl/wp-content/uploads/2026/03/100326-doc-estrategia-de-digitalizacion.pdf).
- [dato] En mayo de 2026, el Ministerio informó que el 70% de los chequeos realizados ubicó a las mipymes participantes en niveles “inicial” o “novato” de madurez digital. El dato describe a quienes completaron el diagnóstico y no se usa aquí como estimación representativa de todas las mipymes chilenas. [Fuente: Ministerio de Economía](https://www.economia.gob.cl/2026/05/26/subsecretaria-de-economia-firma-alianza-para-sumar-la-ia-a-cursos-para-emprendedores.htm).
- [dato] La estrategia identifica restricciones de liquidez, costos de implementación y mantenimiento, oferta tecnológica limitada y desconfianza en proveedores como dificultades para adoptar soluciones digitales. [Fuente: Ministerio de Economía](https://www.economia.gob.cl/wp-content/uploads/2026/03/100326-doc-estrategia-de-digitalizacion.pdf).
- [dato] Sercotec incluye sitios web y herramientas de marketing entre las inversiones digitales orientadas a gestión, comercialización e innovación. [Fuente: Sercotec](https://www.sercotec.cl/programas/ruta-digital/).
- [dato] No se dispone de una fuente chilena verificada que ordene las palabras técnicas que más confunden al público específico de STAX. Las decisiones terminológicas del plan son hipótesis editoriales que deben comprobarse con personas reales.

### Condiciones verificadas del proyecto STAX

- [dato] La landing principal es una sola página estática: `index.html`.
- [dato] El recorrido inicial real es `#inicio` → `#necesidades` → `#demos`.
- [dato] El Hero contiene un simulador Alpine con seis rubros: Salud, Cafetería, Salón, Catálogo, Asesoría e Inmobiliaria.
- [dato] La sección `#demos` contiene diez tarjetas. Fonoaudiología, Salón y Tienda Online están visibles inicialmente; las otras siete usan `x-show="showAllDemos"`.
- [dato] El repositorio contiene 14 demostraciones, aunque la cuadrícula principal muestra diez.
- [dato] El commit `3665812` reemplazó intencionalmente el antiguo panel `.clarity-tunnel` por el simulador interactivo actual.
- [dato] `tests/landing-exhaustive.spec.js` todavía espera `.clarity-tunnel`; ese contrato está desactualizado respecto del código vigente.
- [dato] `index.html` tiene cambios locales sin commit. Este plan no atribuye autoría ni autoriza descartarlos.

### Problemas del dueño de mipyme que orientan el cambio

1. [supuesto] Entender rápidamente si STAX vende una página web, publicidad, una agenda o automatización.
2. [supuesto] Mostrar servicios, valores, horarios, ubicación o cobertura sin repetirlos en cada conversación.
3. [supuesto] Permitir que la persona consulte por un servicio, producto o reserva identificable.
4. [supuesto] Reconocer un ejemplo parecido a su forma de atender antes de comparar planes.
5. [supuesto] Entender alcance, precio y control sin interpretar palabras técnicas.

### Términos que no deben aparecer sin traducción

La posible confusión es [supuesto]. La alternativa es la redacción que debe usarse en las primeras tres secciones.

| Evitar | Usar |
|---|---|
| Landing page | Página web |
| Demo | Ejemplo funcionando |
| CTA | Botón o siguiente paso |
| Conversión / CRO | Visitas que terminan consultando |
| Hosting | Servicio donde se publica la página |
| Dominio | Nombre o dirección web |
| Responsive | Se ve y funciona bien en celular y computador |
| Integración | Conexión con otra herramienta |
| Variantes | Modelos, tamaños o colores |
| Modalidades | Presencial, a domicilio u online |

## Cambios propuestos por sección

### Hero

#### Cambio 1 — Recuperar la promesa comercial vigente y nombrar el producto

- **Qué cambia:** usar el `<h1>` aprobado por la identidad activa, en dos líneas: **“Que te vean”** / **“Que te crean”**. Cambiar el badge a **“Páginas web para mipymes chilenas”**.
- **Por qué:** [dato] `README.md` y `AGENTS.md` declaran “Que te vean. Que te crean.” como propuesta vigente, mientras el Hero muestra otra promesa. [supuesto] El badge permite mantener la frase de marca sin ocultar qué vende STAX.
- **Problema del mipyme que resuelve:** distinguir una página web de publicidad, agenda o automatización.

#### Cambio 2 — Reducir la bajada a una consecuencia concreta

- **Qué cambia:** usar: **“Creamos páginas web para que tus clientes revisen servicios, valores y horarios antes de escribirte por WhatsApp.”**
- **Por qué:** [supuesto] La frase identifica producto, información y siguiente paso sin introducir “contexto”, “conversión” ni una promesa de ventas.
- **Problema del mipyme que resuelve:** entender qué información dejará disponible y para qué sirve.

#### Cambio 3 — Hacer predecibles los dos CTA

- **Qué cambia:** CTA principal **“Hablar por WhatsApp”** hacia `#contacto`; CTA secundario **“Ver ejemplos”** hacia `#demos`.
- **Por qué:** [supuesto] “Revisar lo que explico” y “ver qué podemos ordenar” exigen interpretar qué ocurrirá después.
- **Problema del mipyme que resuelve:** saber si abrirá contacto o ejemplos antes de hacer clic.

#### Cambio 4 — Mantener el simulador y simplificar su lenguaje

- **Qué cambia:** conservar estructura, seis botones, imágenes, mensajes y enlaces. Reemplazar solo estas etiquetas:
  - “Simulador Interactivo en Vivo” → **“Ejemplo interactivo”**.
  - “Prueba tu rubro” → **“Elige un rubro”**.
  - “Mensaje prellenado al contactar” → **“Mensaje que llega a WhatsApp”**.
  - “Prueba la experiencia real” → **“Abre el ejemplo”**.
  - “Ver demo en vivo” → **“Ver ejemplo funcionando”**.
- **Por qué:** [dato] el simulador es la evolución más reciente del Hero y ya reutiliza seis demos reales. [supuesto] Traducir sus etiquetas conserva la prueba visual sin agregar jerga.
- **Problema del mipyme que resuelve:** reconocerse por rubro y comprender la interacción.

#### Cambio 5 — Eliminar la repetición geográfica

- **Qué cambia:** conservar **“Desde Biobío para negocios de todo Chile”** una sola vez. Eliminar “Atención en todo Chile” de la lista inferior. Mantener en formato compacto “Precios en CLP, neto + IVA” y “Dominio y accesos bajo tu control”.
- **Por qué:** [dato] la cobertura nacional aparece dos veces dentro del Hero. [supuesto] Las otras dos señales responden a costo y propiedad sin repetir la propuesta principal.
- **Problema del mipyme que resuelve:** confirmar cobertura, forma de precio y control sin duplicación.

### Necesidades

#### Cambio 1 — Hablar desde una tarea cotidiana

- **Qué cambia:** mantener el kicker **“Parte por cómo atiendes hoy”**. Usar como título **“¿Qué información repites todos los días?”** y como bajada **“La dejamos ordenada para que tus clientes sepan qué revisar antes de escribirte.”**
- **Por qué:** [supuesto] La repetición diaria es más reconocible que “elegir necesidades” y conecta directamente con el problema que resuelve la página.
- **Problema del mipyme que resuelve:** identificar el costo cotidiano de responder lo mismo.

#### Cambio 2 — Reducir las cinco tarjetas sin cambiar su estructura

- **Qué cambia:** conservar las cinco tarjetas, iconografía, grilla y encabezados; reemplazar únicamente sus descripciones:
  - **Atiendes en un local:** “Servicios, horarios, ubicación y cómo llegar.”
  - **Haces delivery:** “Productos, valores, zonas de entrega y cómo pedir.”
  - **Trabajas con reservas:** “Servicios, horas disponibles y qué debe saber la persona antes de reservar.”
  - **Vendes por catálogo:** “Fotos, modelos, tamaños, colores y valores.”
  - **Quieres cobrar en línea:** “Primero revisamos precios, disponibilidad, cobro y entrega.”
- **Por qué:** [supuesto] Las listas concretas son más fáciles de escanear y eliminan “modalidades”, “variantes” y “operación preparada”.
- **Problema del mipyme que resuelve:** reconocerse por forma de atención sin conocimientos técnicos.

#### Cambio 3 — Simplificar el cierre

- **Qué cambia:** usar **“No necesitas elegir un plan ahora. Cuéntanos cómo atiendes y te orientamos.”**
- **Por qué:** [supuesto] Mantiene la reducción de riesgo y elimina una segunda explicación sobre “ordenar primero”.
- **Problema del mipyme que resuelve:** avanzar sin saber todavía qué plan comprar.

### Demos

#### Cambio 1 — Mantener la expansión que ya existe

- **Qué cambia:** ninguno en cantidad, orden, `x-data`, `x-show`, `x-cloak` o rutas. Permanecen tres tarjetas visibles y diez disponibles.
- **Por qué:** [dato] la solución de divulgación progresiva recomendada por el análisis anterior ya está implementada.
- **Problema del mipyme que resuelve:** conservar variedad sin extender inicialmente toda la cuadrícula.

#### Cambio 2 — Reescribir la introducción

- **Qué cambia:** kicker **“Ejemplos para distintos negocios”**; título **“Mira cómo puede funcionar en un negocio como el tuyo”**; bajada **“Abre un ejemplo y revisa qué puede saber una persona antes de escribir por WhatsApp.”**
- **Por qué:** [supuesto] Sustituye “demostraciones de criterio” y “comparar posibilidades con transparencia” por una acción observable.
- **Problema del mipyme que resuelve:** comprobar si STAX entiende una atención parecida a la suya.

#### Cambio 3 — Mantener evidencia de criterio con etiquetas más claras

- **Qué cambia:** cada tarjeta conserva una frase principal y dos datos breves, pero reemplaza:
  - “Qué deja claro” por **“Antes de escribir”**.
  - “Qué puedes revisar” por **“En tus mensajes puedes revisar”**; en la demo Agenda se usa **“En el panel puedes revisar”**.
  - “Ver demo en vivo” por **“Ver ejemplo funcionando”**; Agenda usa **“Ver panel funcionando”**.
- **Por qué:** [dato] `AGENTS.md` exige presentar qué ordena cada demo y qué puede revisar el dueño. [supuesto] Las nuevas etiquetas explican cuándo y dónde ocurre cada observación.
- **Problema del mipyme que resuelve:** distinguir información para el cliente de información que luego observa el dueño.

#### Cambio 4 — Copy exacto de las diez tarjetas

| Tarjeta | Frase principal | Antes de escribir | En mensajes o panel puedes revisar |
|---|---|---|---|
| Fonoaudiología Infantil | Permite conocer servicios, forma de atención y opciones para solicitar una evaluación. | Servicios, atención y agenda. | Si indican servicio y horario. |
| Psicóloga Clínica | Permite conocer especialidad, atención presencial u online y opciones de reserva. | Especialidad, atención y reserva. | Si indican atención y horario. |
| Café de Especialidad | Permite revisar carta, valores, horarios y alternativas de pedido o retiro. | Carta, valores y pedidos. | Si indican producto, cantidad o fecha. |
| Salón de Belleza | Permite revisar servicios, referencias y cómo solicitar una hora. | Servicios, referencias y reserva. | Si indican servicio y fecha. |
| Catálogo de Productos | Permite recorrer productos, elegir opciones y preparar un pedido por WhatsApp. | Productos, opciones y pedido. | Si indican producto y cantidad. |
| ContaDigital Asesoría | Permite comparar planes, valores y alcance antes de pedir una cotización. | Planes, valores y alcance. | Si indican plan o necesidad. |
| Cobre & Co. Propiedades | Permite revisar propiedades, precios y solicitar una visita. | Propiedad, precio y visita. | Si indican propiedad y horario. |
| Tienda Online con Auto-Administración | Permite elegir productos, pagar y seguir un pedido desde una tienda administrable. | Productos, pago y seguimiento. | Si el pedido incluye selección y datos. |
| Gestor y Agenda de Clientes | Muestra cómo el negocio recibe, confirma y gestiona citas y contactos. | Servicio, hora y datos de contacto. | Citas, estado y contacto. |
| Casa Ronda | Permite comparar experiencias, valores y condiciones antes de consultar una fecha. | Experiencias, valores y condiciones. | Si indican experiencia y fecha. |

- **Por qué:** [supuesto] El copy describe tareas observables y elimina descripciones de estilos como “Bento Grid”, “split-screen”, “asimétrico” o “portal corporativo”.
- **Problema del mipyme que resuelve:** evaluar utilidad comercial sin interpretar vocabulario de diseño.

#### Cambio 5 — Simplificar el botón de expansión

- **Qué cambia:** texto cerrado **“Ver los 10 ejemplos”**; texto abierto **“Mostrar menos”**. Mantener el mismo botón y estado Alpine.
- **Por qué:** [supuesto] “Demostraciones en vivo” agrega palabras sin cambiar la acción.
- **Problema del mipyme que resuelve:** anticipar con claridad que se mostrarán más ejemplos.

## Objeciones del red team y resolución

| Objeción | Resolución |
|---|---|
| Cambiar el H1 puede eliminar una promesa que ya funciona. | Se usa la propuesta vigente declarada en `README.md` y `AGENTS.md`; el producto se nombra en el badge y la bajada. El efecto debe medirse. |
| El simulador y Demos duplican rubros. | Se conserva el simulador porque el commit más reciente lo incorporó como prueba interactiva del Hero. Se reduce su lenguaje; no se añade otra interfaz. |
| Mostrar solo tres rubros puede excluir a otros negocios. | El simulador mantiene seis rubros y la cuadrícula conserva diez ejemplos accesibles. No se cambia la selección destacada sin datos de uso. |
| Quitar “Qué puedes revisar” incumple el contrato de las demos. | No se elimina. Se traduce a “En tus mensajes puedes revisar” o “En el panel puedes revisar”. |
| La frase “para que” puede interpretarse como garantía. | El texto describe la función prevista de la página y no afirma resultados cuantificados ni ventas. Las pruebas con usuarios deben verificar la interpretación. |
| Actualizar el título SEO amplía el alcance fuera de las tres secciones. | Solo se alinea `<title>`, Open Graph y Twitter con la propuesta vigente; no se inicia una estrategia SEO nueva. |
| `index.html` ya tiene cambios locales. | La implementación queda condicionada a preservar o separar esos cambios. No se permite restaurar el archivo ni reemplazarlo completo. |

### Cambios descartados

- Mover el simulador completo desde el Hero a Demos.
- Recuperar `.clarity-tunnel`.
- Cambiar los tres ejemplos destacados sin datos de uso.
- Eliminar tarjetas o rutas de demostraciones.
- Crear filtros, carruseles, componentes o dependencias nuevas.
- Añadir precios nuevos o modificar planes.
- Presentar chatbots, Telegram, Voice Live o IA en el recorrido inicial.
- Prometer reducción de consultas, aumento de ventas o una tasa de conversión.

## Validación del agente-mipyme (rubro: peluquería)

Esta es una simulación razonada, no una entrevista real. Todo este bloque es [supuesto].

- “Páginas web para mipymes chilenas” me permite entender qué venden antes de leer la promesa de marca.
- “Que te vean / Que te crean” es fácil de recordar, pero necesita la bajada para saber qué hará la página.
- “Hablar por WhatsApp” y “Ver ejemplos” me indican claramente qué abre cada botón.
- “Ejemplo interactivo” se entiende mejor que “Simulador Interactivo en Vivo”.
- “¿Qué información repites todos los días?” me conecta con precios, horarios y reservas que respondo habitualmente.
- “Modelos, tamaños y colores” se entiende mejor que “variantes”.
- “Antes de escribir” y “En tus mensajes puedes revisar” separan lo que verá el cliente de lo que podré observar después.
- Si la tarjeta de Salón queda entre las tres visibles, puedo reconocer mi rubro sin expandir la cuadrícula; no hace falta cambiar las destacadas actuales.

Esta revisión mantiene la frase de marca, pero exige nombrar “páginas web” antes o inmediatamente después del H1. También mantiene el simulador y la tarjeta de Salón visible.

## Fuera de alcance

- Chatbot de Telegram y ChatGPT Voice Live.
- Rediseño de las 14 demostraciones.
- Cambios en precios, planes, checkout o condiciones comerciales.
- Reordenamiento de Beneficios, Servicios, Proceso, IA práctica, Precios, FAQ o Contacto.
- Estrategia SEO, campañas, anuncios o adquisición de tráfico.
- Testimonios, casos de éxito o métricas no verificadas.
- Analítica externa o incorporación de servicios de seguimiento.
- Reparaciones visuales generales no causadas por estos cambios.

## Próximos pasos

### Tarea 0 — Resolver el estado local antes de editar

**Archivos:** `index.html`

1. Revisar `git diff -- index.html` con el propietario de los cambios.
2. Preservar el contenido local mediante un commit focalizado o una decisión explícita de integrarlo.
3. No usar `git restore`, `git checkout --`, `git reset` ni reemplazo completo del archivo.

**Salida:** autoría y destino del cambio local definidos sin pérdida de trabajo.

### Tarea 1 — Alinear las pruebas con el simulador vigente

**Archivos:** `index.html`, `tests/landing-exhaustive.spec.js`, `tests/root.spec.js`

1. Sustituir el caso obsoleto de `.clarity-tunnel` por un contrato del simulador dentro de `#inicio`.
2. Añadir `data-testid="hero-rubro-simulator"` al contenedor actual para evitar selectores frágiles.
3. Verificar seis botones de rubro, cambio de contenido al seleccionar “Salón”, enlace `./demo-salon-belleza/index.html` y ausencia de overflow a `390×844`.
4. Mantener la prueba de diez demos después de expandir la cuadrícula.
5. Ejecutar la prueba focalizada y confirmar `PASS` antes de cambiar copy.

### Tarea 2 — Escribir contratos fallidos para el nuevo copy

**Archivos:** `tests/landing-exhaustive.spec.js`, `tests/root.spec.js`, `scripts/production_smoke.js`

1. Esperar el título `STAX | Que te vean. Que te crean.`.
2. Esperar un solo `<h1>` con “Que te vean Que te crean”.
3. Esperar CTA “Hablar por WhatsApp” con `href="#contacto"` y “Ver ejemplos” con `href="#demos"`.
4. Esperar el título de Necesidades “¿Qué información repites todos los días?”.
5. Esperar tres tarjetas de demo visibles antes de expandir y diez después.
6. Esperar las etiquetas “Antes de escribir” y “En tus mensajes puedes revisar”.
7. Ejecutar las pruebas focalizadas y confirmar que fallan por el copy anterior, no por consola, red o estructura.

### Tarea 3 — Implementar el cambio mínimo en la landing

**Archivo:** `index.html`

1. Aplicar exactamente el copy de Hero, Necesidades y Demos definido en este plan.
2. Actualizar `<title>`, `og:title` y `twitter:title` a “Que te vean. Que te crean.” sin modificar otros metadatos.
3. Conservar clases, IDs, rutas, estados Alpine y estructura de la cuadrícula.
4. Añadir únicamente `data-testid="hero-rubro-simulator"` como soporte de prueba.
5. Confirmar mediante `rg` que ya no aparecen “Simulador Interactivo en Vivo”, “Qué deja claro”, “Qué puedes revisar” ni “Ver demo en vivo” en las primeras tres secciones.

### Tarea 4 — Validar comportamiento y lectura

**Archivos:** `index.html`, `tests/landing-exhaustive.spec.js`, `tests/root.spec.js`, `scripts/production_smoke.js`

1. Ejecutar `npm run test_root` y obtener `PASS`.
2. Ejecutar `npx playwright test tests/landing-exhaustive.spec.js --reporter=line` y obtener `PASS`.
3. Revisar el Hero y las tres secciones a `390×844` y `1440×960`: sin desbordamiento, CTA visibles y simulador operable.
4. Ejecutar `npm run qa:gate` y obtener `PASS Preproduction Gate Summary`.
5. Revisar `git diff --check` y separar claramente los cambios de este plan de las modificaciones locales que ya existían en `index.html`.

### Tarea 5 — Validación cualitativa posterior

1. Mostrar el Hero durante una observación breve y preguntar: “¿Qué vende STAX?”, “¿Para quién sirve?” y “¿Qué harías después?”.
2. Registrar las respuestas literales sin sugerir términos.
3. No fijar una meta numérica sin línea base ni volumen suficiente.
4. Ajustar únicamente palabras que las personas no puedan explicar con sus propios términos.
