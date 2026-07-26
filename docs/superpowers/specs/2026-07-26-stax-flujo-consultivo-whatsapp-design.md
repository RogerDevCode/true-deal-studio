# Diseño: flujo consultivo de planes y WhatsApp para STAX

**Estado:** aprobado para planificación e implementación.

## Objetivo

Convertir la landing principal en un recorrido consultivo, explícito y accesible para PYMEs y MIPYMEs chilenas. La persona debe poder reconocer su necesidad, revisar una alternativa, entender su alcance y preparar una consulta por WhatsApp sin que la página infiera decisiones mediante `hover` ni esconda información esencial en interacciones exclusivas de escritorio.

## Punto de partida

La auditoría del 26 de julio de 2026 estableció una línea base de 21/36. La implementación actual pasa el gate de preproducción y las pruebas de la landing, pero presenta cinco brechas:

1. El plan se infiere por tiempo de `hover` y Vitrina Express funciona como valor predeterminado.
2. Las explicaciones de alcance dependen de tooltips inaccesibles en touch y teclado.
3. El recorrido móvil alcanza 19.379 px; precios y contacto aparecen demasiado tarde.
4. Existen combinaciones de bajo contraste, texto de 10–11 px y líneas extensas.
5. CTA, condiciones de IVA, rondas de ajustes y algunas afirmaciones comerciales pierden consistencia.

## Principios de experiencia

- **Orientar antes de vender:** llegar al formulario no implica haber elegido un plan.
- **Elección explícita:** un plan solo queda seleccionado cuando la persona activa su CTA.
- **Control visible:** la selección se muestra, se puede cambiar y se refleja literalmente en WhatsApp.
- **Información esencial disponible:** precio, IVA, alcance, plazo, insumos, propiedad y exclusiones no dependen de `hover`.
- **Menor esfuerzo móvil:** precio inicial y alcance cerrado aparecen temprano; los detalles extensos usan divulgación progresiva accesible.
- **Tono consultivo y tranquilo:** los CTA explican el siguiente paso sin urgencia ni promesas de venta.
- **Compatibilidad local:** todo sigue funcionando con recursos locales y navegación `file://`.

## Alternativas evaluadas

### A. Selección explícita dentro de la landing — elegida

Cada CTA de plan registra una selección, desplaza al formulario y muestra un resumen editable. Si la persona llega directamente, el formulario se mantiene neutral y solicita orientación.

**Ventajas:** conserva el diagnóstico, funciona en mouse/teclado/touch y evita mensajes incorrectos.  
**Costo:** añade un estado pequeño y pruebas específicas.

### B. WhatsApp directo por plan

Cada CTA abre un mensaje prellenado sin pasar por el formulario.

**Descartada porque:** reduce contexto, dificulta editar datos y convierte la comparación en una salida inmediata.

### C. Selector obligatorio en el formulario

La persona debe elegir un plan antes de enviar.

**Descartada porque:** obliga a decidir a quien todavía necesita orientación y contradice el tono consultivo.

## Arquitectura de interacción

### Estado global de la landing

`landingApp()` incorpora un estado explícito:

```js
selectedPlan: null
```

Los planes se describen mediante un mapa único y estable:

```js
planOptions: {
  esencial: {
    label: 'Plan Vitrina Express',
    price: '$99.999 CLP neto + IVA',
    summary: 'Una página de alcance cerrado para mostrar tu oferta y orientar consultas.',
  },
  profesional: {
    label: 'Atención ordenada',
    price: 'Desde $249.990 CLP neto + IVA',
    summary: 'Catálogo, reservas o cotización para ordenar más consultas.',
  },
  premium: {
    label: 'Pedidos en línea',
    price: 'Desde $449.990 CLP neto + IVA',
    summary: 'Venta en línea para una operación preparada para cobrar y entregar.',
  },
}
```

La API de interacción queda limitada a tres operaciones:

```js
selectPlan(planId)
clearSelectedPlan()
getSelectedPlan()
```

Se eliminan `planTimes`, `activePlan`, `hoverStart`, `startPlanHover()`, `endPlanHover()` y `getMostViewedPlan()`.

### CTA de planes

Cada CTA:

1. Ejecuta `selectPlan('<id>')`.
2. Conserva `href="#contacto"` como fallback y navegación offline.
3. Usa una etiqueta consistente: **“Revisar este plan”**.
4. Mantiene foco visible y blanco táctil mínimo de 44 px.

### Formulario neutral

Cuando `selectedPlan === null`, el formulario presenta:

- Encabezado: **“Cuéntanos cómo atiendes”**.
- Apoyo: **“Te orientamos hacia un primer paso acorde a tu negocio.”**
- Botón: **“Preparar mi consulta por WhatsApp”**.
- Mensaje: solicita orientación sin nombrar un plan.

### Formulario con plan

Cuando existe selección, se muestra antes de los campos un resumen con:

- Nombre del plan.
- Precio o valor desde.
- Descripción operativa de una línea.
- Acción **“Cambiar plan”**, que limpia la selección sin borrar los datos escritos.

El botón conserva **“Preparar mi consulta por WhatsApp”**. El mensaje incluye el nombre del plan seleccionado y expresa que la persona quiere revisarlo, no contratarlo automáticamente.

### Recuperación

Después de preparar el mensaje:

- El estado confirma **“Tu mensaje está listo”**.
- **“Ir a WhatsApp”** abre el mismo mensaje construido al enviar.
- **“Editar información”** devuelve al formulario con todos los datos preservados.
- **“Empezar de nuevo”** restablece campos, selección y estado de envío.
- Si la primera apertura de WhatsApp falla, se conserva el formulario y se muestra el enlace directo como recuperación.

## Campos y validación

- Nombre: obligatorio, máximo 80 caracteres.
- Negocio o servicio: obligatorio, máximo 120 caracteres.
- WhatsApp: opcional, pero si se completa debe aceptar un número chileno en formatos habituales con o sin `+56`; el error se muestra junto al campo.
- Información frecuente: opcional, máximo 500 caracteres.
- Los campos declaran `autocomplete` adecuado.
- Los errores usan texto específico, `aria-describedby` y una región anunciable.
- La entrada se conserva ante validación o fallo de apertura.

## Precios y alcance accesibles

- Se elimina la dependencia de `mouseenter` para información comercial.
- Cada plan muestra de forma permanente: etapa, precio, IVA, hitos, plazo, insumos, exclusiones y propiedad.
- Los detalles secundarios se agrupan en un `<details>` con resumen **“Ver detalle del alcance”**.
- El resumen es operable mediante teclado y touch, tiene foco visible y conserva contenido dentro del viewport.
- Vitrina Express repite junto al precio: neto, IVA y total final calculable/visible.
- Los otros planes mantienen “Desde” cuando corresponde y separan costos únicos de servicios externos o recurrentes.

## Copy consultivo

La jerarquía verbal queda así:

| Momento | Texto |
| --- | --- |
| Navegación y hero | “Quiero orientación para mi negocio” |
| CTA de plan | “Revisar este plan” |
| Envío del formulario | “Preparar mi consulta por WhatsApp” |
| Salida final | “Ir a WhatsApp” |

Cambios adicionales:

- Reemplazar “Se ve bien. Se vende mejor.” por una frase centrada en claridad y confianza, sin promesa de ventas.
- Cambiar “los ajustes que necesites hasta que quede como tú quieres” por una explicación coherente con las rondas incluidas en cada plan.
- Retirar o citar afirmaciones como “Más del 80%” y “El público chileno responde mejor”. Al no existir una fuente visible integrada al sitio, la implementación preferirá copy factual sin porcentaje.
- Mantener una sola voz de segunda persona singular y español directo.

## Reducción del recorrido móvil

La estructura conserva las secciones y demos existentes, pero cambia su prioridad:

1. Hero con promesa, orientación y una sola demostración inicial.
2. Franja temprana con valor inicial, alcance cerrado, plazo y propiedad.
3. Necesidades de atención resumidas en cuatro grupos; cobro en línea pasa a la escalera de planes.
4. Demos con tres ejemplos iniciales y expansión existente.
5. Beneficio y límite honesto combinados en un bloque compacto.
6. Proceso reducido a tres pasos, sin loop automático.
7. IA resumida como nota de criterio dentro del proceso o antes de precios.
8. Precios, FAQ priorizada y contacto.

No se eliminarán rutas ni demos. La reducción se obtiene combinando texto repetido, quitando tarjetas decorativas y usando divulgación progresiva.

El CTA flotante de WhatsApp:

- Se oculta cuando el hero, precios o contacto muestran un CTA equivalente.
- Respeta `env(safe-area-inset-bottom)`.
- No cubre texto o controles.
- Conserva un blanco táctil mínimo de 44 px.

## Legibilidad y accesibilidad

- Texto normal y placeholder: contraste mínimo 4,5:1.
- Texto grande: contraste mínimo 3:1.
- Información comercial: mínimo 14 px en móvil.
- Líneas de cuerpo: máximo aproximado de 65–75 caracteres.
- Los botones de tema reciben un anillo de foco visible.
- El menú móvil añade backdrop, cierre con Escape y devolución de foco al disparador.
- Los enlaces que abren demos en nueva pestaña lo informan accesiblemente y usan `rel="noopener"`.
- La jerarquía de encabezados se mantiene lógica y con un único `h1`.
- `prefers-reduced-motion` sigue desactivando movimiento no esencial.

## Estados de WhatsApp

El mensaje se construye desde una sola función pura para evitar divergencia entre envío inicial y enlace de recuperación:

```js
buildWhatsAppMessage({ name, business, phone, details, selectedPlan })
```

Casos:

- Sin plan: solicita orientación inicial.
- Con plan: solicita revisar el plan explícitamente seleccionado.
- Sin teléfono o detalles: omite segmentos vacíos; no genera frases incompletas.
- Caracteres especiales y emoji: se preservan mediante `encodeURIComponent` al construir la URL.

## Pruebas requeridas

### Playwright

1. Seleccionar cada plan en desktop y mobile actualiza el resumen y el mensaje correcto.
2. Llegar directo al formulario conserva estado neutral.
3. “Cambiar plan” limpia la selección y conserva campos.
4. “Editar información” conserva datos; “Empezar de nuevo” restablece todo.
5. Teléfono chileno válido e inválido producen estados accesibles.
6. Los detalles de alcance funcionan con click, touch y teclado.
7. CTA flotante no se solapa con contenido en hero, precios o contacto.
8. Menú móvil cierra con Escape y devuelve el foco.
9. No existe overflow horizontal a 320, 390, 768 y 1440 px.
10. El flujo sigue funcionando bajo `file://` y con fallback de WhatsApp.

### Regresión

- `npm run test_root`
- `npx playwright test tests/landing-exhaustive.spec.js`
- `npm run check_consoles`
- `npm run qa:gate`

## Fuera de alcance

- Rebranding público de STAX.
- Cambios dentro de las demos.
- Integración con CRM, analítica o API externa.
- Cambio de número, dominio, credenciales o servicios externos.
- Testimonios o resultados atribuidos a clientes.

## Criterios de aceptación

- Ningún plan depende de `hover` para quedar seleccionado.
- El formulario y WhatsApp muestran exactamente la elección explícita o un estado neutral.
- La persona puede editar, cambiar plan y restablecer el flujo.
- Toda condición comercial esencial es accesible desde touch y teclado.
- El CTA final mantiene un tono consultivo y no presupone contratación.
- Los contrastes relevantes cumplen WCAG AA.
- El recorrido móvil reduce de forma material la distancia hasta precio y contacto sin retirar información contractual.
- `npm run qa:gate` finaliza en `PASS`.
