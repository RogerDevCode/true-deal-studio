# Enlaces desde la evidencia visual hacia las demos

## Contexto

La sección “Tu oferta preparada para cada conversación” presenta tres imágenes que representan demostraciones existentes. Actualmente funcionan como evidencia visual, aunque su apariencia y reacción al pasar el cursor sugieren una interacción que queda incompleta.

## Objetivo

Permitir que cada persona abra la demostración asociada directamente desde su bloque visual, con una interacción clara, accesible y compatible con navegación local mediante `file://`.

## Solución aprobada

Cada bloque completo —imagen y leyenda— será un enlace que abrirá su demo en la misma pestaña. Esta decisión amplía el área táctil, mantiene una navegación lineal y permite regresar con el control habitual del navegador o con la barra propia de cada demo.

La correspondencia será:

- “Servicios y reservas” → `./demo-fonoaudiologia/index.html`
- “Atención en un local” → `./demo-salon-belleza/index.html`
- “Catálogo y productos” → `./demo-ecommerce-tech/index.html`

## Señales de interacción

- El bloque completo responderá al clic o toque.
- Cada bloque tendrá foco visible mediante teclado.
- La imagen conservará su ampliación suave al pasar el cursor.
- La leyenda incorporará “Ver demo →” como señal explícita y breve.
- Cada enlace tendrá un nombre accesible que describa el destino.

## Compatibilidad y alcance

- Se conservarán imágenes, textos descriptivos, estructura de tres columnas y estilos temáticos existentes.
- Se usarán rutas relativas explícitas al archivo `index.html` de cada demo.
- La navegación ocurrirá en la misma pestaña.
- El cambio se limitará a esta evidencia visual y a sus pruebas automatizadas.

## Validación

- Confirmar los tres destinos mediante Playwright.
- Activar al menos uno de los enlaces y comprobar la URL final.
- Verificar foco visible, área interactiva completa y ausencia de desbordamiento en móvil.
- Ejecutar la puerta de preproducción para comprobar navegación `file://`, recursos y consola.

