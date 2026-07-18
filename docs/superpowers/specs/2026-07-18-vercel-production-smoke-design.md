# Diseño: smoke de producción en Vercel

**Estado:** aprobado para implementación.

## Objetivo

Hacer que la verificación de producción de True Deal Studio valide el despliegue vigente en Vercel y cubra todas las páginas públicas del proyecto.

## Alcance

- Usar `https://true-deal-studio.vercel.app/` como URL productiva en `scripts/production_smoke.js`.
- Recorrer la landing, el aviso de privacidad y los catorce `demo-*/index.html` públicos.
- Verificar por página: respuesta HTTP exitosa, título esperado, `lang="es-CL"`, un `<h1>`, metadatos Open Graph requeridos, Twitter card, JSON-LD y `Cache-Control`.
- Actualizar la URL del JSON-LD activo de la landing al dominio Vercel.
- Agregar una prueba unitaria del smoke con `fetch` simulado que proteja el dominio, la cobertura de rutas y los requisitos de cada página.

## Límites

- El smoke no seguirá enlaces ni recursos de terceros; WhatsApp y Google Maps se validan en las pruebas de navegación existentes y no deben volver frágil el control de despliegue.
- No cambia copy, estructura de las páginas, demos, flujos de formulario ni configuración de Vercel.
- Los documentos históricos conservan las URLs que registran decisiones anteriores.

## Diseño técnico

`scripts/production_smoke.js` concentrará la constante de origen Vercel y el inventario explícito de páginas con sus títulos. Exportará sus utilidades y una función principal para que el test pueda sustituir `fetch` sin hacer llamadas de red. La ejecución por CLI conservará la salida `PASS <url>` y devolverá un código distinto de cero ante una respuesta o metadato inválido.

`tests/production-smoke.spec.js` construirá respuestas HTML mínimas válidas y comprobará que el runner solicita las dieciséis URLs del origen Vercel. También verificará que un título incorrecto rechaza la validación.

## Validación

- Ejecutar `npx playwright test tests/production-smoke.spec.js`.
- Ejecutar `npm run qa:prod-smoke` contra Vercel.
- Ejecutar `npm run qa:ci` para comprobar la regresión completa.

## Revisión propia

- Sin marcadores pendientes ni decisiones ambiguas.
- El alcance incluye dominio, títulos, inventario, SEO, caché, JSON-LD y prueba aislada.
- Los servicios de terceros quedan fuera del smoke por ser dependencias externas no controladas.
