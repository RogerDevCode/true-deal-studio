# Diseño: propuesta comercial consultiva para demo de fonoaudiología

## Objetivo

Mejorar la claridad comercial de `demo-fonoaudiologia/index.html`, comenzando por un hero más breve y fácil de leer. La página debe ayudar a una familia chilena a comprender el servicio, la modalidad a domicilio, el aporte de la primera visita y el siguiente paso por WhatsApp.

## Dirección elegida

La demo conservará su identidad cálida, familiar y profesional. La mejora prioriza lenguaje concreto, jerarquía compacta y afirmaciones sanitarias prudentes. La estructura seguirá siendo HTML estático con Alpine.js local y funcionamiento completo bajo `file://`.

Se descartan cambios de marca, imágenes nuevas, dependencias, rutas, número de contacto y servicios externos.

## Evidencia de partida

La medición del hero actual entrega estos resultados:

| Vista | Tamaño del h1 | Líneas del h1 | Líneas del texto de apoyo |
|---|---:|---:|---:|
| 390 × 844 | 39,2 px | 5 | 9 |
| 768 × 900 | 48 px | 3 | 5 |
| 1440 × 900 | 60 px | 4 | 5 |

En 390 px, el hero comienza cerca del píxel 218, el CTA principal cerca del 794 y la imagen cerca del 1.022. La oportunidad principal está en reducir contenido y altura previa antes de disminuir de forma marcada la escala tipográfica.

## Hero aprobado

### Etiqueta

`Fonoaudiología infantil a domicilio · Santiago`

### Titular

`Acompañamos su lenguaje desde casa.`

El titular expresa una sola idea y conserva una escala editorial. Usará entre 38 y 40 px en móvil, 48 px en tablet y entre 52 y 56 px en escritorio. El ancho máximo del bloque será cercano a 34rem.

### Texto de apoyo

`Una primera visita basada en el juego para conocer cómo se comunica tu hijo, orientar a la familia y acordar juntos el siguiente paso.`

### Acciones

- Principal: `Solicitar primera visita`.
- Secundaria: `Consultar por WhatsApp`.

### Señales de confianza

`Atención a domicilio · Orientación para la familia · Coordinación por WhatsApp`

La imagen existente permanece como evidencia visual. En móvil debe comenzar a aparecer dentro o inmediatamente después de la primera pantalla, según la altura disponible.

## Navegación móvil y espacio inicial

- Compactar la navegación transversal de demos y el aviso comercial.
- Presentar en móvil `Demo · Fonoaudiología infantil` y una acción breve `Volver`.
- Usar una cabecera principal de aproximadamente 64 px en móvil y conservar 80 px desde `md`.
- Mantener controles con área táctil mínima de 44 px.
- Mantener la navegación de escritorio y el retorno explícito a `../index.html`.

La primera sección debe comenzar antes del píxel 180 en una vista de 390 × 844.

## Primera visita como propuesta concreta

La sección `#enfoque`, ubicada inmediatamente después del hero, cambiará su función desde una filosofía abstracta hacia una explicación práctica.

### Encabezado

`¿Qué aporta la primera visita?`

### Introducción

`El encuentro permite observar cómo se comunica tu hijo durante el juego, conversar sobre tus inquietudes y definir una orientación inicial para la familia.`

### Tres aportes

1. `Observar jugando` — reconocer formas actuales de comunicación en un entorno familiar.
2. `Escuchar a la familia` — comprender rutinas, dudas y situaciones cotidianas.
3. `Acordar el siguiente paso` — entregar orientaciones iniciales y explicar alternativas de acompañamiento.

## Orden comercial

La secuencia de lectura será:

1. Hero.
2. Aporte de la primera visita (`#enfoque`).
3. Áreas de apoyo (`#areas`).
4. Proceso (`#como-funciona`).
5. Profesional y confianza (`#sobre-mi`).
6. Preguntas frecuentes.
7. Footer y vías de contacto.

El cambio reutiliza las secciones existentes y conserva sus identificadores.

## Acciones y formulario

La acción principal se expresará como solicitud en toda la experiencia:

- Cabecera y hero: `Solicitar primera visita`.
- Modal: `Solicitar primera visita`.
- Envío: `Preparar solicitud por WhatsApp`.
- Áreas de apoyo: `Consultar esta área`.

El modal mantendrá campos, validación, selección predeterminada, reinicio de estado, almacenamiento local y apertura de WhatsApp.

El texto introductorio será:

`Cuéntanos tus datos y una preferencia de horario. Prepararemos el mensaje para coordinar contigo la visita a domicilio.`

La fecha se presentará como preferencia sujeta a coordinación. Se añadirá una nota con enlace explícito a `../privacidad.html`:

`Usaremos estos datos para preparar y coordinar tu solicitud por WhatsApp. Revisa el aviso de privacidad.`

## Confianza profesional verificable

- Cambiar `Especialista en Desarrollo Infantil` por `Fonoaudióloga con enfoque en comunicación y desarrollo infantil`.
- Presentar el Registro Nacional de Prestadores Individuales como evidencia verificable únicamente cuando exista el antecedente correspondiente.
- En esta demo, el bloque de confianza explicará que una publicación real puede enlazar el registro oficial de la profesional.
- Mantener el carácter demostrativo visible en la barra superior.

## Prudencia clínica

Reemplazar formulaciones absolutas por aportes observables:

- `¿Por qué la atención a domicilio es más efectiva?` pasa a `¿Qué aporta la atención a domicilio?`.
- La respuesta explicará que el hogar permite observar rutinas, elementos familiares y formas cotidianas de comunicación.
- `Contacto y Pre-Diagnóstico` pasa a `Orientación inicial y coordinación`.
- Las referencias por edad se presentarán como orientación general y conducirán a una evaluación individual.
- Retirar expresiones que prometan ansiedad en cero, avance acelerado o superioridad clínica universal.

## Contenido comercial pendiente de datos reales

La estructura puede mostrar valor, comunas, duración, medios de pago, disponibilidad y condiciones de cancelación cuando la profesional entregue información confirmada. Esta iteración conservará solamente hechos ya presentes: atención a domicilio en Santiago y coordinación por WhatsApp.

## Accesibilidad y comportamiento

- Mantener `lang="es-CL"`, un único `h1`, metadatos sociales y JSON-LD.
- Mantener texto móvil desde 14 px, foco visible, contraste WCAG AA y controles de 44 px.
- Mantener el orden lógico del DOM después de reubicar secciones.
- Mantener Alpine.js y `alpine-collapse.min.js` locales.
- Mantener compatibilidad con teclado y reducción de movimiento.
- Mantener rutas explícitas y recursos locales.

## Contratos de aceptación

1. El hero muestra exactamente la etiqueta, titular, texto y acciones aprobados.
2. El h1 ocupa hasta tres líneas en 390 px y hasta dos líneas en 1440 px.
3. El hero comienza antes del píxel 180 en 390 × 844.
4. El CTA principal aparece dentro de la primera pantalla móvil.
5. `#enfoque`, `#areas`, `#como-funciona` y `#sobre-mi` aparecen en ese orden.
6. El modal usa lenguaje de solicitud y contiene el enlace a privacidad.
7. Las afirmaciones clínicas absolutas quedan fuera del texto visible.
8. La selección de servicio, reinicio del modal y apertura de WhatsApp conservan su comportamiento.
9. La vista permanece libre de desbordamiento horizontal en 390, 768 y 1440 px.
10. Las pruebas focalizadas y `npm run qa:gate` finalizan en PASS.
