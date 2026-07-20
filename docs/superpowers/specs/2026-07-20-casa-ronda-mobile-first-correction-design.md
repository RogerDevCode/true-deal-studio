# Casa Ronda: corrección editorial mobile-first

**Estado:** aprobado para planificación.

## Objetivo

Corregir el demo Casa Ronda para que la lectura tenga prioridad sobre el gesto gráfico. La nueva versión debe conservar su personalidad editorial, pero eliminar contrastes insuficientes, titulares desproporcionados, ideas fragmentadas y composiciones que nacen desde escritorio.

La implementación mantiene marca, fotografía, cinco secciones, honestidad comercial, accesibilidad, funcionamiento offline y el flujo de elegir una experiencia y preparar una consulta por WhatsApp.

## Dirección aprobada

La dirección visual es **Editorial sereno**:

- porcelana y papel como superficies dominantes;
- berenjena como color principal de lectura;
- coral reservado para detalles, selección y énfasis;
- caléndula con texto berenjena para la acción principal;
- fotografía editorial como fuente de emoción;
- jerarquía compacta y lectura lineal en móvil.

El fondo coral de sección completa desaparece. Hero y consulta pueden conservar berenjena como dos extremos intencionales de la narración, siempre con textos que superen el contraste requerido.

## Regla de escritura

Cada titular comunica una sola idea y ocupa como máximo dos líneas en los anchos de validación. Cuando el texto no cabe, se reescribe; no se reduce hasta volverlo ilegible ni se permite que el navegador corte una frase en puntos arbitrarios.

Los titulares aprobados son:

1. Hero:
   - `Aquí el cumpleaños`
   - `se vive en ronda.`
2. Experiencias:
   - `Elige su manera`
   - `de celebrar.`
3. Recorrido:
   - `Una tarde con`
   - `un plan claro.`
4. Preguntas:
   - `Antes de reservar`
5. Consulta:
   - `Revisemos la fecha`
   - `contigo.`

Los saltos de las ideas de dos líneas se expresan mediante dos bloques `span`. El encabezado de preguntas permanece en un solo bloque porque contiene una sola frase breve.

## Escala tipográfica

### Móvil, desde 320 px

- `h1`: entre 40 y 44 px; nunca supera 44 px.
- `h2`: entre 32 y 38 px; nunca supera 38 px.
- títulos de experiencia y resumen: máximo 28 px.
- texto principal: mínimo 16 px.
- información auxiliar: mínimo 13 px cuando no sea decorativa.
- altura de línea de titulares: entre 0.96 y 1.05.

### Escritorio, desde 900 px

- `h1`: máximo 64 px.
- `h2`: máximo 48 px.
- títulos de experiencia y resumen: máximo 32 px.

El escritorio amplía la composición, no reemplaza la estructura ni introduce una escala independiente y teatral.

## Color y contraste

Todo texto funcional, etiqueta, botón y contenido informativo debe alcanzar una relación mínima de contraste de `4.5:1` con su fondo efectivo.

Decisiones obligatorias:

- eliminar texto blanco sobre coral porque la combinación actual alcanza aproximadamente `3.15:1`;
- usar berenjena sobre caléndula en el CTA principal;
- usar porcelana sobre berenjena en superficies oscuras;
- usar berenjena o una variante opaca equivalente sobre porcelana, papel y fondos suaves;
- reservar coral oscuro para texto solo cuando la combinación verificada alcance `4.5:1`;
- no depender únicamente del color para representar una experiencia seleccionada: conservar borde, texto y `aria-pressed`.

Los adornos sin contenido pueden usar menor contraste, pero no deben interferir con texto ni controles.

## Arquitectura mobile-first

La base CSS corresponde a una columna desde 320 px. Las mejoras de escritorio se añaden únicamente mediante consultas `min-width`.

### 1. Hero

Orden móvil:

1. marca y contexto;
2. titular;
3. texto de apoyo;
4. acción principal y enlace secundario;
5. datos esenciales;
6. fotografía;
7. nota `Un plan claro para la familia` integrada debajo de la fotografía.

La nota deja de superponerse sobre la imagen. La fotografía mantiene el recorte circular, pero reduce adornos y no compite con la acción principal.

### 2. Experiencias

Las tres experiencias se apilan verticalmente en móvil. Se elimina el carrusel horizontal y cualquier tarjeta parcialmente visible.

Cada tarjeta muestra, en este orden:

1. situación familiar;
2. nombre y edad;
3. duración, grupo y valor desde;
4. botón de selección.

Las tarjetas reducen altura, sombras y variación cromática. En escritorio pueden formar tres columnas alineadas, sin rotaciones ni desplazamientos verticales.

### 3. Así se vive

El recorrido se presenta como una secuencia vertical numerada sobre una superficie clara y cálida. Los cinco pasos comparten una línea de continuidad, pero dejan de ser cajas alternadas de coral y caléndula.

En escritorio la secuencia puede distribuirse horizontalmente si mantiene legibilidad y orden lógico.

### 4. Antes de reservar

Las preguntas usan `details` nativos en todos los tamaños. Cada `summary` tiene una zona táctil mínima de 44 px, indicador visible, foco claro y texto berenjena sobre fondo claro.

Los tres compromisos permanecen como cierre compacto de la sección.

### 5. Consulta

El resumen y el formulario se apilan en móvil. Los campos tienen:

- etiquetas visibles de al menos 13 px;
- controles de al menos 48 px de alto;
- texto de entrada de al menos 16 px;
- foco visible;
- mensajes de riesgo y éxito con contraste mínimo `4.5:1`.

El único botón principal usa caléndula con texto berenjena. La acción conserva el texto `Preparar consulta por WhatsApp`.

## Comportamiento conservado

No cambia la interfaz de `window.casaRondaApp` ni sus datos:

- `choosePackage(plan)` selecciona y desplaza hacia la consulta;
- `submitReservation()` prepara el mensaje de WhatsApp con la necesidad opcional;
- `resetDemo()` limpia selección, formulario, éxito y almacenamiento local;
- el selector elegido conserva `aria-pressed="true"`;
- el fallback de WhatsApp permanece disponible;
- la navegación usa rutas compatibles con `file://`;
- no se incorporan dependencias, CDN ni recursos remotos.

## Criterios de aceptación

### Visuales

- En 320, 390 y 768 px no existe desplazamiento horizontal.
- En 320 y 390 px cada titular aprobado ocupa una o dos líneas.
- En 390 px el `h1` no supera 44 px, los `h2` no superan 38 px y los títulos de tarjetas no superan 28 px.
- En 1440 px el `h1` no supera 64 px y los `h2` no superan 48 px.
- Las experiencias aparecen completas y apiladas en móvil.
- La nota familiar no cubre la fotografía.
- No existe una sección completa con fondo coral.

### Accesibilidad

- Los pares de texto y fondo funcionales alcanzan al menos `4.5:1`.
- Los controles táctiles principales miden al menos 44 px de alto; los campos, al menos 48 px.
- El foco por teclado es visible.
- `prefers-reduced-motion` sigue activo.
- Se conserva un único `h1` y la jerarquía semántica existente.

### Funcionales

- Elegir `Ronda Pequeña` actualiza el resumen y `aria-pressed`.
- El formulario prepara un enlace de WhatsApp con nombre, edad, asistentes, fecha, experiencia y necesidad opcional.
- Restablecer limpia selección, campos y clave local.
- La página funciona mediante servidor HTTP y `file://` sin errores de consola ni recursos remotos.

### Validación

- Ampliar `tests/demo-casa-colores.spec.js` con comprobaciones en 320, 390, 768 y 1440 px.
- Medir desborde, tamaños calculados, cantidad de líneas de titulares y alturas de controles.
- Verificar los pares de contraste definidos por el sistema de color.
- Ejecutar la prueba focalizada y `npm run qa:gate`.
- Después del push, comprobar el despliegue público con Playwright en 390 y 1440 px.

## Fuera de alcance

- Cambiar el nombre Casa Ronda.
- Reemplazar la fotografía existente.
- Cambiar paquetes, precios o datos solicitados.
- Añadir pagos, calendario, backend o confirmación automática.
- Rediseñar la landing STAX más allá de cualquier ajuste mínimo necesario para mantener coherencia con la tarjeta existente.
