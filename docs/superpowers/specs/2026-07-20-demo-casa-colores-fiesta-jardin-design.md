# Rediseño del demo Casa de los Colores: Fiesta Jardín

**Estado:** aprobado para planificación.

## Objetivo

Rediseñar `demo-casa-colores/index.html` para que una madre, padre o apoderado chileno de un niño de 4 a 10 años perciba una celebración alegre, cuidada y confiable. El resultado debe abandonar la rigidez neo-brutalista y la retícula inspirada en Mondrian sin perder claridad comercial, funcionamiento offline ni la reserva preparada por WhatsApp.

La página mantiene cuatro secciones y demuestra el alcance del Plan Vitrina Express.

## Audiencia y decisión de compra

La persona adulta busca resolver cinco preguntas antes de escribir:

1. ¿El lugar se ve acogedor y apropiado para la edad?
2. ¿Qué incluye cada alternativa?
3. ¿Cuántos niños pueden asistir y cuánto dura?
4. ¿Habrá acompañamiento y se podrán conversar necesidades alimentarias?
5. ¿Cómo consulto una fecha sin explicar todo nuevamente?

El diseño debe transmitir alegría infantil a través de color y movimiento suave, y tranquilidad adulta mediante información legible, espacios amplios y señales concretas de acompañamiento.

## Dirección visual: Fiesta Jardín

La identidad se inspira en una celebración preparada con guirnaldas de tela, papeles recortados, flores simples y una mesa compartida. No usa personajes licenciados, clichés de jardín infantil, colores neón ni estética de videojuego.

### Paleta

- **Nube cálida — `#FFF9F3`:** fondo principal.
- **Tinta ciruela — `#352B38`:** texto y controles.
- **Frambuesa — `#B83F68`:** acción principal y marca.
- **Cielo — `#78B7C4`:** descanso visual y confianza.
- **Hoja — `#6E8B72`:** acompañamiento y mensajes de seguridad.
- **Durazno — `#F2A27F`:** acento festivo secundario.

La frambuesa es el acento dominante. Cielo, hoja y durazno se reservan para la ilustración, las diferencias entre paquetes y señales informativas; no compiten simultáneamente en cada bloque.

### Tipografía

- **Titulares:** `Instrument Serif`, desde `../assets/fonts/instrument-serif-400.ttf`.
- **Texto, navegación y controles:** `DM Sans`, usando los pesos locales 400, 500 y 700.
- Se eliminan Google Fonts y cualquier otra carga remota.
- Los titulares usan formas amplias y expresivas, pero mantienen frases completas en líneas intencionales.

### Materialidad

- Bordes finos en ciruela con baja opacidad.
- Radios variables y orgánicos; no todos los contenedores tienen la misma forma.
- Sombras suaves teñidas de frambuesa o ciruela.
- Trama local muy tenue de puntos y pétalos construida con CSS.
- Ilustración hero original en SVG/HTML: una mesa de cumpleaños, guirnalda, pastel y figuras infantiles abstractas, sin rostros ni fotografías de menores.

## Firma visual

El elemento memorable es una **guirnalda-ruta** que nace en la ilustración del hero y reaparece como línea curva entre las decisiones principales: elegir experiencia, revisar lo incluido y preparar la consulta. La ruta organiza la lectura; no es una animación decorativa permanente.

## Diagramación

### Vista general

```text
┌──────────────────────────────────────────────────────────────┐
│ marca        Experiencias · Qué cuidamos         Consultar   │
├──────────────────────────────────────────────────────────────┤
│   promesa + CTA                   escena de celebración       │
│   confianza y edades          guirnalda / mesa / confeti      │
├──────────────────────────────────────────────────────────────┤
│      Explora                                                    │
│             Crea               tarjetas escalonadas           │
│                    Celebra      con una recomendada            │
├──────────────────────────────────────────────────────────────┤
│ acompañamiento ─── comida ─── actividad ─── espacio           │
│             recorrido curvo, no cuatro cajas iguales          │
├──────────────────────────────────────────────────────────────┤
│ resumen elegido             formulario breve                  │
│ datos que ya sabemos        consulta por WhatsApp             │
└──────────────────────────────────────────────────────────────┘
```

En móvil, todo se presenta en una sola columna. La escena del hero aparece debajo de la promesa, las experiencias usan desplazamiento horizontal con `scroll-snap` y el formulario conserva controles de al menos 44 px.

## Secciones

### 1. Hero: una celebración que también disfrutan los adultos

- Promesa principal: **“Su día para jugar. Tu tranquilidad para disfrutarlo.”**
- Apoyo: celebraciones para niños de 4 a 10 años con actividad, espacio preparado y acompañamiento.
- CTA principal: **“Ver experiencias”**.
- Enlace secundario: **“Consultar una fecha”**.
- Señales breves: `4 a 10 años`, `grupos acotados`, `consulta por WhatsApp`.
- Escena ilustrada asimétrica con profundidad suave; reemplaza todos los cuadros Mondrian.

### 2. Experiencias: elegir sin comparar una tabla

Las tres alternativas mantienen nombres, duración, capacidad y valores actuales, pero aparecen como tarjetas escalonadas:

- **Explora:** recomendada para una celebración pequeña y primera experiencia.
- **Crea:** destaca una actividad manual para llevar.
- **Celebra:** pensada para un grupo más amplio.

Cada tarjeta muestra primero para quién sirve, luego duración, cupo y valor. El botón conserva los nombres accesibles `Elegir Explora`, `Elegir Crea` y `Elegir Celebra`.

Al seleccionar una experiencia:

- la tarjeta cambia su estado visual;
- aparece el texto existente `<nombre> elegido para tu celebración`;
- la página desplaza suavemente hacia la reserva;
- el comportamiento se mantiene accesible con teclado y `prefers-reduced-motion`.

### 3. Qué cuidamos: confianza antes que decoración

Se reemplazan las cuatro cajas iguales por un recorrido editorial:

- **Juegos acompañados:** actividades adecuadas a la edad.
- **Momento creativo:** material y actividad preparados.
- **Colación conversada:** las restricciones alimentarias se revisan antes de confirmar.
- **Adultos informados:** horario, capacidad y próximos pasos claros.

El bloque incluye una nota honesta: disponibilidad, menú y necesidades específicas se confirman por WhatsApp. No se inventan protocolos, certificaciones, testimonios ni resultados.

### 4. Reserva: una consulta preparada

- El resumen de experiencia seleccionada queda visible junto al formulario en escritorio y encima en móvil.
- Campos actuales: nombre de quien reserva, edad, asistentes y fecha.
- El botón mantiene el texto `Preparar mensaje por WhatsApp`.
- El estado exitoso explica que la disponibilidad aún debe confirmarse.
- `Restablecer demo` limpia selección, formulario y la clave local existente.

## Contenido y tono

- Español chileno natural, sin diminutivos excesivos ni expresiones infantiles dirigidas al adulto.
- Frases cortas, concretas y serenas.
- No se prometen “cumpleaños perfectos”, seguridad absoluta ni ausencia de imprevistos.
- Se usan “niños”, “familia” y “apoderado” solo cuando aportan claridad.
- El precio se presenta como “valor desde” y la disponibilidad siempre se confirma.

## Accesibilidad, funcionamiento y compatibilidad

- Mantener `lang="es-CL"`, un único `h1`, jerarquía lógica y metadatos actuales.
- Agregar enlace para saltar al contenido, foco visible y contraste WCAG AA.
- Conservar Alpine.js local, rutas relativas y funcionamiento bajo `file://`.
- No agregar CDN, fuentes remotas ni nuevas dependencias.
- Usar SVG decorativo con `aria-hidden="true"`; los contenidos esenciales permanecen en HTML.
- Mantener `prefers-reduced-motion`.
- Evitar `!important` salvo `[x-cloak]` y la regla existente de movimiento reducido.

## Contratos funcionales que no cambian

- `window.casaColoresApp`.
- Datos y nombres de los tres paquetes.
- Selección de paquete y resumen visible.
- Construcción del mensaje `wa.me`.
- Clave `stax-demo-casa-colores` en `localStorage`.
- Restablecimiento completo del demo.
- Cuatro hijos `section` directos dentro de `main`.
- Enlace de regreso `../index.html`.

## Validación

1. Ajustar la prueba focalizada para verificar la nueva promesa, señales de confianza y estado seleccionado sin atarla a detalles decorativos.
2. Ejecutar `npx playwright test tests/demo-casa-colores.spec.js`.
3. Ejecutar `npm run test_root`.
4. Ejecutar `npm run qa:gate`; debe finalizar en `PASS` antes de aprobar el despliegue.
5. Revisar capturas locales en 390 × 844 y 1440 × 1000.
6. Confirmar que no hay recursos remotos, desbordamiento horizontal, errores de consola ni fallas de red.
7. Hacer commit y push.
8. Validar en Vercel el hero, selección de experiencia, reserva y vista móvil.

## Alcance

El rediseño afecta `demo-casa-colores/index.html` y las pruebas estrictamente necesarias. `app.js` solo cambia si hace falta exponer el estado visual seleccionado sin modificar el contrato de reserva. La tarjeta de la landing conserva su ruta y puede ajustar su miniatura o texto en un commit separado si el nuevo lenguaje visual lo requiere.
