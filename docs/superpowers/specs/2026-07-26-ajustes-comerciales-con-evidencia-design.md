# Diseño: ajustes comerciales con evidencia para STAX

**Estado:** aprobado por el usuario al solicitar implementar las recomendaciones validadas de `docs/auditoria.md`.

## Objetivo

Mejorar claridad comercial y confianza en la landing principal sin transformar la propuesta consultiva en una promesa de ventas, sin inventar resultados y sin aumentar el recorrido móvil. La intervención conserva la marca STAX, el titular **“Que te vean. Que te crean.”**, la selección explícita de planes y el formulario que prepara una consulta con contexto.

## Principios

- Explicar beneficios observables antes que términos técnicos.
- Mantener el nombre reconocible del producto —página web— y complementarlo con su función comercial.
- Presentar precios netos, IVA y total final o referencial sin ocultar condiciones.
- Mantener la orientación como acción principal, libre de urgencia y escasez artificial.
- Reutilizar secciones existentes y reservar calculadoras, badges, testimonios, garantías o casos de éxito para una etapa con evidencia autorizada.
- Preservar compatibilidad `file://`, recursos locales, rutas, accesibilidad y comportamiento de WhatsApp.

## Enfoques evaluados

### A. Refinamiento factual focalizado — elegido

Actualizar hero, franja de precio, lenguaje técnico, totales y microcopy de alcance dentro de la estructura actual.

**Ventajas:** corrige fricciones reales, conserva confianza y evita aumentar longitud.  
**Costo:** prioriza confianza y claridad por sobre una transformación agresiva de CRO o resultados todavía sin medición.

### B. Reescritura comercial completa

Sustituir titular, planes y tono por promesas directas de ventas, ahorro, urgencia y garantía total.

**Descartado porque:** contradice el posicionamiento aprobado, requiere evidencia futura y modifica alcances comerciales pendientes de autorización.

### C. Añadir módulos persuasivos sin retirar contenido

Agregar antes/después, calculadora, sellos, diagnóstico gratuito y testimonios.

**Descartado porque:** aumentaría el recorrido móvil y varios módulos dependen de métricas, políticas o clientes reales que quedan fuera del alcance actual.

## Cambios de contenido

### Hero

Se conserva el `h1` y se reemplaza el subtítulo por:

> Creamos páginas web que ordenan tus servicios, valores y horarios para que tus clientes lleguen a WhatsApp con más contexto.

La categoría “páginas web” permanece por claridad. El beneficio se expresa como organización y contexto, libre de garantías de venta.

### Franja temprana de precio

La franja conserva precio, plazo y propiedad, y ofrece dos decisiones explícitas:

- **“Ver los 3 planes”** → `#precios`.
- **“Necesito orientación”** → `#contacto`.

Ambas acciones usan foco visible y blancos táctiles mínimos de 44 px. “Ver los 3 planes” mantiene mayor jerarquía visual; orientación funciona como alternativa tranquila.

### Lenguaje técnico público

Dentro de las tarjetas comerciales:

- “Hosting Gratuito Incluido” pasa a **“Tu página publicada y disponible”**.
- “HTTPS” pasa a **“conexión segura para tus clientes”**.
- “Código limpio” y “Estructura SEO profesional” pasan a explicaciones sobre información ordenada, velocidad y preparación para buscadores.
- “Optimizada para Google” pasa a **“Preparada para buscadores”**, con una descripción centrada en estructura y legibilidad para buscadores.

El footer reemplaza “HTML + Tailwind CSS + Alpine.js” por:

> Hecho en Chile · Atención para negocios de todo el país

Los comentarios de código pueden conservar términos técnicos porque permanecen fuera del contenido visible.

### Precios

Los tres planes mantienen valor neto y condición “Desde” cuando corresponde.

- Vitrina Express: **Total con IVA: $118.999 CLP**.
- Atención ordenada: **Total referencial desde $297.488 CLP con IVA**.
- Pedidos en línea: **Total referencial desde $535.488 CLP con IVA**.

Los totales de los planes mayores son referenciales porque el alcance final se cotiza. Los hitos netos existentes se conservan para evitar diferencias causadas por redondeo.

El estado global `planOptions` incorpora la misma información para que el resumen seleccionado mantenga la transparencia.

### Divulgación del alcance

Se conservan los tres `<details>` porque reducen densidad y son accesibles. Sus resúmenes pasan de “Ver detalle del alcance” a:

> Revisar condiciones, plazos y soporte

La información decisiva —ideal para, insumos, exclusiones, precio y principales prestaciones— continúa visible antes de abrirlos.

## Lenguaje afirmativo

El contenido visible privilegia construcciones positivas y orientadas a acciones. Las limitaciones comerciales se expresan mediante fórmulas como:

- **“Queda fuera del alcance:”** para exclusiones del plan.
- **“Se cotiza por separado:”** para ampliaciones disponibles.
- **“Tus servicios quedan a tu nombre:”** para propiedad y control.
- **“Puedes comenzar con orientación:”** para decisiones todavía abiertas.

La palabra “No” se retira del copy visible de `index.html` cuando existe una alternativa afirmativa clara. Identificadores técnicos como `no-js`, clases, comentarios o propiedades CSS conservan su forma porque pertenecen al funcionamiento interno.

## Contraste en temas claro y oscuro

La revisión abarca todo `index.html`, con atención especial a hero y menú:

- El hero claro recibe una capa marfil más profunda y controlada para separar texto, botones y simulador del fondo fotográfico.
- El texto principal del hero usa azul tinta de alto contraste en ambos temas; los CTA conservan contraste mínimo WCAG AA.
- El header transparente usa fondo marfil semitransparente, borde y texto azul tinta en ambos temas.
- El menú móvil usa una superficie opaca o casi opaca, texto oscuro en tema claro y texto claro en tema oscuro, con estados hover/foco visibles.
- Las bandas claras usan fondos lino más profundos y tarjetas blancas diferenciadas mediante borde visible.
- Las bandas oscuras usan texto secundario más luminoso y acentos que alcancen 4,5:1 para texto normal.
- Formularios, placeholders, FAQ, detalles, footer y enlaces mantienen contraste AA en reposo, hover y foco.

Los pares de color críticos se verifican con estilos computados en Playwright, además de inspección visual en 320×568, 390×844, 768×1024 y 1440×900 para ambos temas.

## Confianza factual

Fotografías, RUT, testimonios, sellos y garantías quedan reservados para una etapa con datos autorizados. Esta tarea refuerza únicamente hechos ya presentes:

- trabajo realizado desde Biobío para negocios de todo Chile;
- dominio y accesos bajo control del cliente;
- alcance, plazos y aportes definidos antes de iniciar;
- acompañamiento y soporte según cada plan.

## Límites explícitos

- Ventas, cierres, pedidos, ahorro de horas y recuperación de inversión quedan fuera de las promesas públicas.
- Testimonios, personajes, cifras, cupos y casos de éxito requieren evidencia futura.
- Devoluciones y garantías comerciales nuevas requieren aprobación empresarial previa.
- “Seguridad total”, posiciones en Google y resultados inmediatos quedan fuera del vocabulario público.
- El flujo consultivo mediante formulario se mantiene como ruta principal hacia WhatsApp.
- Los `<details>` y la cantidad actual de secciones se conservan.
- Demos, marca, metadatos, número de WhatsApp, servicios externos y dependencias permanecen estables.
- `docs/auditoria.md` permanece como archivo de referencia ajeno a esta implementación.

## Pruebas

Las pruebas Playwright deben verificar:

1. El subtítulo factual del hero y ausencia de promesas de ventas.
2. La franja temprana contiene exactamente las dos rutas nuevas.
3. Los totales con IVA aparecen en los tres planes y en los resúmenes seleccionados.
4. El contenido visible queda libre de `Hosting`, `HTTPS`, `SEO`, `HTML`, `Tailwind` y `Alpine.js`.
5. Los tres detalles conservan operación por teclado/touch y el nuevo texto de resumen.
6. El ancho documental permanece dentro del viewport en 320, 390, 768 y 1440 px.
7. El flujo plan → formulario → WhatsApp conserva selección, edición, reset y fallback.
8. Hero, menú, secciones claras, bandas oscuras, formulario y footer cumplen los contratos de contraste en ambos temas.
9. `npm run qa:gate` termina en `PASS`.

## Criterios de aceptación

- La promesa de marca y el tono consultivo permanecen intactos.
- La persona entiende qué se construye y qué información ordena sin jerga de desarrollo.
- Puede elegir entre comparar planes o pedir orientación antes de recorrer el resto de la página.
- Todos los planes muestran su total con IVA de forma consistente y sin alterar su alcance.
- El contenido mantiene afirmaciones comerciales demostrables.
- El detector Impeccable entrega una salida limpia y el gate final queda en `PASS`.

## Auto-revisión

- **Placeholders:** el documento queda libre de `TBD`, `TODO` y decisiones pendientes.
- **Consistencia:** hero, precios, resumen de plan y WhatsApp conservan el mismo tono y datos.
- **Alcance:** intervención limitada a `index.html`, pruebas y documentación de esta mejora.
- **Ambigüedad:** los totales mayores se etiquetan explícitamente como referenciales y se distinguen de la cotización final.
