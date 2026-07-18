# Plan de implementación: oferta clara antes de WhatsApp

**Especificación fuente:** `docs/superpowers/specs/2026-07-18-propuesta-whatsapp-clara-design.md`  
**Alcance:** actualización estratégica de la landing principal, con reutilización de sus componentes, estilos y demos actuales.

## Resultado esperado

La landing explica que una página prepara la conversación comercial antes de WhatsApp. El visitante entiende qué información puede ordenar, cómo se relaciona el servicio con la IA y cuál es el primer paso adecuado para su negocio.

La implementación conserva el catálogo de 14 demostraciones, compatibilidad `file://`, SEO, accesibilidad y los flujos actuales de contacto por WhatsApp.

## Decisiones de alcance

- El cambio se concentra en `index.html`; las demos mantienen su identidad visual y comportamiento.
- La marca pública actual se conserva durante este ciclo. `True Deal Studio` identifica el repositorio y queda disponible para una posterior fase de identidad visual y actualización legal/SEO coordinada.
- Los datos y casos se presentan como demostraciones transparentes, sin testimonios ni resultados atribuidos a clientes.
- Los precios actuales se mantienen y se vuelven más fáciles de encontrar, junto con su alcance, plazos, accesos y propiedad.

## Fase 1 — Inventario y mapa de copy

**Archivos:** `index.html`

1. Identificar el hero actual, bloque de razones para tener web, catálogo, panel de CTA, planes, FAQ y formulario de contacto.
2. Catalogar las frases que prometen resultados amplios, usan tecnicismos o construcciones negativas.
3. Crear un mapa interno de reemplazos con la regla: cada beneficio se formula mediante una acción observable del negocio.
4. Conservar atributos, IDs, clases y estados Alpine que usan los scripts de prueba.

**Criterio de salida:** mapa aprobado contra la especificación y ausencia de cambios estructurales innecesarios.

## Fase 2 — Hero y recorrido inicial

**Archivo:** `index.html` (sección `#inicio`)

1. Reemplazar el titular y bajada por la promesa aprobada: “Tu oferta clara antes del WhatsApp.”
2. Explicar el escenario de local, delivery o conversación, con productos o servicios, valores desde, horarios y forma de pedir antes de escribir.
3. Ajustar CTA principal hacia “Revisar mi atención por WhatsApp” y enlazarlo a la conversación/formulario existente mediante el mecanismo ya usado por la landing.
4. Añadir el apoyo “Partimos por lo que hoy explicas cada día.”
5. Conservar contraste, jerarquía de un único `h1`, comportamiento móvil y controles de tema.

**Criterio de salida:** el primer viewport comunica el beneficio operativo en lenguaje afirmativo y el CTA conserva una acción funcional.

## Fase 3 — Beneficio concreto y límite honesto

**Archivo:** `index.html` (bloque de valor actualmente cercano a “Por qué tener tu web propia”)

1. Convertir el bloque en “Una vitrina que trabaja junto a ti”.
2. Presentar los cinco elementos operativos: oferta, valores/rangos, horarios/ubicación/cobertura, WhatsApp preparado y base para crecer.
3. Incluir el bloque “Cada herramienta tiene un trabajo concreto” para separar el papel de la página de la atención y entrega del negocio.
4. Usar frases afirmativas: mostrar qué habilita cada elemento, en lugar de formular la idea como prevención de un problema.
5. Reutilizar tarjetas, iconos y estilos existentes; evitar agregar dependencias o componentes nuevos.

**Criterio de salida:** el visitante puede identificar al menos una mejora cotidiana que la página habilita.

## Fase 4 — Catálogo de demostraciones como evidencia de criterio

**Archivo:** `index.html` (sección `#demos`)

1. Actualizar introducción y encabezado: las demos muestran cómo cambia una conversación según el tipo de negocio.
2. Para cada tarjeta visible, añadir una capa breve y uniforme:
   - `Qué ordena`: información que queda disponible antes de WhatsApp.
   - `Qué puedes revisar`: métrica operativa sugerida para el primer mes.
3. Mantener nombre del rubro, imagen, enlace `./demo-nombre/index.html` y apertura actual de cada demo.
4. Dar prioridad a ejemplos que reflejen local, delivery, servicios, catálogo, reservas y consultas comerciales.
5. Revisar descripciones existentes para que describan la decisión del cliente y la conversación resultante.

**Criterio de salida:** las 14 demos siguen accesibles y cada una comunica problema, información ordenada y métrica sugerida sin insinuar un resultado histórico.

## Fase 5 — IA, precios y confianza visible

**Archivo:** `index.html` (bloques de beneficios, planes y FAQ)

1. Incorporar una sección breve “La IA puede ser parte del proceso.”
2. Explicar que la IA acelera ideas, textos y tareas; el servicio define información importante, publica una página útil y ordena la atención.
3. Actualizar la FAQ de IA para mantener el mismo enfoque, en lugar de centrarla únicamente en chatbot.
4. Antes o dentro de `#precios`, hacer visibles: valor o valor desde, alcance, plazos, accesos, dominio, contenidos y propiedad.
5. Ajustar la escalera de planes para mostrar el avance prudente: oferta clara → catálogo/reservas/cotización → e-commerce preparado para operación en línea.

**Criterio de salida:** la comparación con IA recibe una respuesta práctica y los planes muestran con claridad qué obtiene y controla el cliente.

## Fase 6 — CTA y formulario

**Archivo:** `index.html` (sección `#contacto`)

1. Actualizar título, apoyo, placeholder y texto de botón según el CTA aprobado: “Conversemos sobre lo que hoy explicas por WhatsApp” y “Quiero ordenar mi oferta”.
2. Mantener la generación de mensaje, validaciones, fallback de ventana y enlaces `wa.me` actuales.
3. Orientar los campos a la información de diagnóstico: oferta, tipo de atención, delivery/local y datos que el dueño repite con frecuencia.
4. Revisar etiquetas, foco, mensajes y estado móvil para accesibilidad.

**Criterio de salida:** un envío válido abre WhatsApp con el contexto de una propuesta y los formularios conservan sus comportamientos actuales.

## Fase 7 — SEO, accesibilidad y control de calidad

**Archivos:** `index.html`, pruebas existentes según necesidad.

1. Ajustar `title`, meta description, Open Graph, Twitter y JSON-LD para reflejar la propuesta, conservando `lang="es-CL"` y un solo `h1`.
2. Revisar que el copy visible aplique el lenguaje afirmativo definido en la especificación.
3. Añadir o actualizar pruebas Playwright para comprobar:
   - titular y CTA principal;
   - bloque de IA y transparencia;
   - información de las demos;
   - envío de formulario hacia WhatsApp;
   - navegación de demos bajo `file://`.
4. Ejecutar `node test_root.js`, `node test_cafe.js`, `node test_salon.js`, `node test_artesanias.js`, `node test_contabilidad.js`, `node check_consoles.js` y `node scripts/preproduction_gate.js`.
5. Si Playwright falta en el entorno, registrar el bloqueo de dependencia, instalar o restaurar la dependencia mediante el flujo autorizado y repetir la suite antes de despliegue.

**Criterio de salida:** puerta de preproducción en `PASS`, enlaces relativos validados, consola limpia y experiencia de contacto comprobada.

## Orden de ejecución

1. Fases 1–3: promesa, beneficio y límite.
2. Fase 4: catálogo como prueba de criterio.
3. Fases 5–6: IA, transparencia, planes y conversión.
4. Fase 7: SEO, accesibilidad y validación completa.

## Riesgos y controles

| Riesgo | Control |
| --- | --- |
| Copy largo o abstracto | Priorizar una idea y una acción por bloque; probar lectura móvil. |
| Promesa interpretada como garantía de ventas | Mantener el alcance operativo explícito y métricas observables. |
| Lenguaje que compite con la IA | Reconocer su utilidad y explicar el trabajo de adaptación al negocio. |
| Tarjetas de demo demasiado cargadas | Usar dos líneas fijas y reutilizar jerarquía visual existente. |
| Regresión de contacto o navegación offline | Conservar enlaces y funciones actuales; validar con Playwright y gate. |
