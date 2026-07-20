# Casa Ronda: segunda evolución del demo de celebraciones

**Estado:** aprobado para planificación.

## Objetivo

Transformar `demo-casa-colores` en **Casa Ronda**, una demostración de negocio infantil que despierte deseo y reduzca el riesgo percibido para madres, padres y apoderados chilenos de niños de 4 a 10 años.

El rediseño puede reemplazar marca, estructura, copy, paleta, tipografía, ilustraciones e interacciones. Solo debe conservar honestidad comercial, accesibilidad, funcionamiento offline y el flujo esencial de elegir una experiencia y preparar una consulta por WhatsApp.

## Tesis creativa

Una celebración no se vende mediante una lista de prestaciones. Se vende cuando una familia puede imaginar la tarde, entender cómo se organiza y preguntar por una fecha sin sentir que ya quedó comprometida.

Casa Ronda se construye alrededor de tres ideas:

1. **Movimiento compartido:** jugar y crear en grupo.
2. **Plan visible:** la persona adulta entiende los momentos y responsabilidades.
3. **Consulta de bajo riesgo:** preguntar no cobra ni reserva automáticamente.

## Marca

### Nombre

**Casa Ronda**

“Casa” aporta cercanía y lugar. “Ronda” comunica participación, movimiento y pertenencia sin infantilizar al adulto.

### Promesa

**Aquí el cumpleaños se vive en ronda.**

### Apoyo

Juegos, creación, comida y tiempo compartido para niños de 4 a 10 años. La familia conoce el plan antes de reservar.

### Voz

- Directa, cálida y adulta.
- Chilena sin modismos forzados.
- Describe situaciones observables.
- Evita diminutivos, superlativos y promesas de perfección.
- Usa “niños”, “familia” y “apoderados” cuando aportan claridad.

## Sistema visual

La identidad debe sentirse editorial, física y festiva. No usa la estética beige-boutique de Fiesta Jardín, bloques neo-brutalistas, personajes licenciados, neón ni degradados tecnológicos.

### Paleta

- **Berenjena — `#2D2032`:** tinta, navegación y contraste.
- **Coral ronda — `#F06459`:** acción principal.
- **Caléndula — `#F3C84B`:** energía y señalización.
- **Verde agua — `#A8D7CC`:** calma y acompañamiento.
- **Azul juego — `#4464AD`:** profundidad secundaria.
- **Porcelana — `#FFFDF8`:** superficie principal.

Coral es la acción dominante. Caléndula, verde agua y azul identifican momentos o experiencias; nunca aparecen todos como fondos simultáneos.

### Tipografía local

- **Marca y rótulos breves:** `Archivo Black`, desde `../assets/fonts/archivo-black-400.ttf`.
- **Titulares y frases emocionales:** `Newsreader`, pesos 500 y 700 desde `../assets/fonts/`.
- **Información, formularios y navegación:** `DM Sans`, pesos 400, 500 y 700.
- No se cargan fuentes, estilos ni scripts remotos.

### Fotografía hero

Crear un activo original local en `demo-casa-colores/assets/casa-ronda-hero.webp`.

Dirección:

- fotografía editorial cenital;
- mesa de cumpleaños preparada;
- manos de niños creando con papel, lápices y materiales;
- pastel sencillo, platos y guirnalda;
- luz natural de tarde;
- paleta coherente con Casa Ronda;
- diversidad sugerida mediante manos y materiales, sin mostrar rostros;
- sin textos incrustados, marcas, personajes licenciados ni logos.

La fotografía se presenta como imagen conceptual del demo, no como registro de un cliente real.

### Firma gráfica

Un círculo grande funciona como ventana hacia la celebración. El motivo circular reaparece como:

- recorte de la fotografía;
- selector de experiencia;
- ruta de momentos;
- marcador de la consulta preparada.

El círculo no se repite en cada componente. Es una firma estructural, no decoración indiscriminada.

## Arquitectura narrativa

La página cambia de cuatro a cinco secciones directas dentro de `main`.

### 1. Hero: imaginar la tarde

Objetivo: producir deseo y entregar las primeras señales de seguridad.

Contenido:

- marca Casa Ronda;
- titular `Aquí el cumpleaños se vive en ronda.`;
- apoyo comercial;
- CTA `Elegir una experiencia`;
- enlace secundario `Consultar una fecha`;
- datos: `4 a 10 años`, `Hasta 24 invitados`, `Consultar no tiene costo`;
- fotografía circular;
- tarjeta superpuesta `Un plan claro para la familia`.

En escritorio, la fotografía invade parcialmente el área tipográfica. En móvil, el CTA queda visible antes de la fotografía y dentro del primer viewport de 844 px.

### 2. Elige el tipo de tarde

Los paquetes dejan de llamarse Explora, Crea y Celebra.

#### Ronda Pequeña

- Contexto: cumpleaños tranquilo con el grupo más cercano.
- Edad: 4 a 7 años.
- Duración: 2 horas.
- Capacidad: hasta 12 niños.
- Valor desde: `$149.000`.

#### Manos a la Obra

- Contexto: actividad creativa y un recuerdo para llevar.
- Edad: 6 a 10 años.
- Duración: 3 horas.
- Capacidad: hasta 18 niños.
- Valor desde: `$189.000`.

#### La Gran Ronda

- Contexto: más invitados y varios momentos compartidos.
- Edad: 7 a 10 años.
- Duración: 3 horas.
- Capacidad: hasta 24 invitados.
- Valor desde: `$239.000`.

Cada experiencia incluye:

- situación familiar reconocible;
- edad;
- duración;
- capacidad;
- valor desde;
- botón accesible `Elegir <nombre>`.

La experiencia seleccionada:

- queda marcada con `aria-pressed="true"`;
- actualiza un resumen visible;
- modifica el color del círculo de contexto;
- acompaña a la persona hasta la consulta.

### 3. Así se vive una Ronda

Objetivo: reemplazar afirmaciones abstractas por un proceso observable.

Momentos:

1. **Nos encontramos:** recibimos al grupo y explicamos la primera actividad.
2. **Jugamos juntos:** una persona del equipo guía el momento de juego.
3. **Creamos algo:** materiales preparados para una actividad manual.
4. **Compartimos la mesa:** colación y torta en un momento definido.
5. **Cerramos con calma:** ordenamos el final y avisamos a la familia.

El proceso se representa como recorrido editorial, no como cinco tarjetas iguales. Una línea circular conecta cada momento. No se inventan protocolos sanitarios, proporciones de personal ni certificaciones.

### 4. Antes de reservar

Objetivo: resolver objeciones reales antes del formulario.

Preguntas y respuestas visibles:

#### ¿Puedo conversar alergias o restricciones?

Sí. Cuéntanos la necesidad en la consulta. Antes de confirmar revisamos contigo las alternativas de colación y lo que la familia debe aportar.

#### ¿Cuántos adultos pueden acompañar?

Depende de la experiencia y del tamaño del grupo. Lo dejamos acordado antes de confirmar la fecha.

#### ¿Qué debe llevar la familia?

Después de conocer la experiencia indicamos qué está incluido y qué debe traer la familia, como torta, velas o elementos personales.

#### ¿Cómo se confirma la fecha?

Primero revisamos disponibilidad por WhatsApp. La fecha queda confirmada solo cuando ambas partes aceptan las condiciones informadas.

#### ¿Consultar significa pagar?

No. Preparar y enviar la consulta no realiza cobros ni confirma automáticamente una reserva.

La sección también muestra tres compromisos honestos:

- información acordada antes de confirmar;
- espacio preparado para recibir al grupo;
- cierre y próximos pasos informados a la familia.

### 5. Consulta de bajo riesgo

El formulario mantiene:

- nombre de quien reserva;
- edad que celebra;
- cantidad de asistentes;
- fecha preferida;
- experiencia seleccionada.

Agrega un campo opcional:

- `Necesidad que debemos conversar`, para alimentación, accesibilidad u otra consideración.

El mensaje de WhatsApp incluye la necesidad solo cuando se completa.

Antes del botón aparece:

**Consultar una fecha no realiza ningún cobro ni confirma la reserva.**

El botón conserva el propósito:

`Preparar consulta por WhatsApp`

El estado de éxito aclara que el mensaje quedó preparado y que la disponibilidad aún debe revisarse.

## Interacciones

### Selección de experiencia

`choosePackage(plan)` mantiene la selección y el desplazamiento hacia la consulta. El estado seleccionado se expone en:

- tarjeta;
- resumen flotante;
- texto dentro de la consulta;
- atributo `data-selected-plan` del contenedor principal.

### Preguntas

Las cinco respuestas permanecen visibles en escritorio. En móvil pueden usar elementos `details` nativos, con la primera pregunta abierta. No requieren Alpine ni JavaScript adicional.

### Restablecimiento

`resetDemo()` limpia:

- experiencia;
- campos existentes;
- necesidad opcional;
- estado de éxito;
- clave local.

### WhatsApp

El mensaje incluye:

- nombre;
- experiencia;
- edad;
- asistentes;
- fecha preferida;
- necesidad opcional, si existe.

Mantiene el número demostrativo actual y el fallback existente.

## Honestidad comercial

- El footer identifica el proyecto como `Demo ficticio creado para mostrar una Vitrina Express`.
- La fotografía es conceptual y no se atribuye a clientes.
- No se agregan dirección, testimonios, valoraciones, ventas, certificaciones ni garantías inexistentes.
- Los valores se presentan `desde`.
- Disponibilidad, alimentación, adultos acompañantes y condiciones se confirman antes de reservar.

## Responsive

### Móvil: 360–430 px

- CTA principal visible antes de la fotografía.
- Navegación reducida a marca y acción.
- Experiencias en carrusel horizontal con `scroll-snap`.
- Proceso en recorrido vertical.
- Preguntas con `details`.
- Formulario en una columna.
- Sin desbordamiento horizontal.

### Escritorio: 1024 px o más

- Hero asimétrico con superposición controlada.
- Experiencias en composición diagonal.
- Proceso horizontal con una línea continua.
- Preguntas en dos columnas editoriales.
- Consulta dividida entre resumen y formulario.

## Accesibilidad y compatibilidad

- Mantener `lang="es-CL"`, un solo `h1`, jerarquía lógica y metadatos.
- Mantener enlace para saltar al contenido.
- Usar `alt` que describa la fotografía conceptual.
- Controles de al menos 44 px.
- Foco visible y contraste WCAG AA.
- Respetar `prefers-reduced-motion`.
- Alpine.js, fuentes, imagen y scripts locales.
- Mantener rutas relativas y navegación bajo `file://`.
- No agregar dependencias.
- `!important` solo para `[x-cloak]` y movimiento reducido.

## Archivos

- Reemplazar: `demo-casa-colores/index.html`.
- Modificar: `demo-casa-colores/app.js`.
- Crear: `demo-casa-colores/assets/casa-ronda-hero.webp`.
- Modificar: `tests/demo-casa-colores.spec.js`.
- Ajustar si corresponde: tarjeta Casa Ronda en `index.html`.

## Validación

1. El test focalizado verifica Casa Ronda, cinco secciones, tres experiencias nuevas, pregunta de pago, campo opcional, mensaje WhatsApp y reset.
2. Capturas locales en 390 × 844 y 1440 × 1000.
3. Sin desbordamiento horizontal.
4. Sin recursos remotos, errores de consola ni fallas de red.
5. `npx playwright test tests/demo-casa-colores.spec.js tests/root.spec.js`.
6. `npm run qa:gate` finaliza en `PASS`.
7. Commit y push después de cada bloque modificado.
8. Validación pública en Vercel de hero, selección, preguntas y consulta.
