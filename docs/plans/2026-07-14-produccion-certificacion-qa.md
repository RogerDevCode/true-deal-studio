# Certificación de Producción y QA Exigente

Fecha: 2026-07-14
Proyecto: `web_promotion`
Objetivo: dejar el repositorio certificable para producción con un estándar exigente de confianza comercial, usando GitHub + Cloudflare Pages/Workers.

## 1. Objetivo de negocio

El sitio debe poder presentarse como un activo serio, estable y profesional frente a clientes potenciales. La certificación no se limitará a que "cargue bien", sino a demostrar que:

- el entorno es reproducible;
- la calidad se valida automáticamente;
- el despliegue queda bloqueado si se rompe algo crítico;
- la versión pública en Cloudflare responde correctamente;
- el repositorio deja trazabilidad suficiente para operar como producto real.

## 2. Alcance

La certificación cubrirá cinco capas:

1. **Entorno reproducible**
   - `package.json`
   - dependencias explícitas
   - versión de Node definida
   - scripts oficiales de QA

2. **QA local estricto**
   - navegación `file://`
   - navegación HTTP local
   - errores de consola y red
   - SEO base por página
   - validación de assets y rutas
   - flujos críticos de demos principales

3. **Auditoría de calidad web**
   - Lighthouse CI
   - thresholds bloqueantes
   - foco en performance, accessibility, best practices y SEO

4. **Pipeline CI bloqueante**
   - GitHub Actions
   - ejecución automática en push y pull request
   - fallo del pipeline ante cualquier regresión crítica

5. **Smoke test post-deploy**
   - validación contra `https://web-promotion.dev-n8n-stax.workers.dev/`
   - checks básicos de disponibilidad, contenido y assets críticos

## 3. No objetivos

Esta fase no incluirá:

- reescritura completa del sitio a otro framework;
- backend productivo nuevo;
- monitoreo enterprise externo de pago;
- refactors visuales no relacionados con certificación.

## 4. Arquitectura técnica

### 4.1 Dependencias

Se añadirá un entorno Node formal con:

- `playwright`
- `@lhci/cli`
- `serve` o servidor estático equivalente
- utilidades mínimas para scripts Node

La elección prioriza herramientas ampliamente usadas, mantenibles y compatibles con un sitio estático.

### 4.2 Organización esperada

- `package.json`
- `playwright.config.js`
- `lighthouserc.js`
- `scripts/`
- `tests/`
- `.github/workflows/`

La suite actual ad hoc quedará reemplazada o absorbida por scripts versionados dentro del repo. No se aceptarán referencias a tests "externos" o temporales como dependencia crítica de producción.

## 5. Suite de validación

### 5.1 Gate técnico principal

El gate unificado seguirá siendo `scripts/preproduction_gate.js`, pero deberá apoyarse en un entorno formal y no depender de supuestos externos.

Su función será:

- validar SEO base y estructura HTML;
- validar assets y rutas relativas;
- validar compatibilidad `file://`;
- ejecutar la suite automatizada existente dentro del repo;
- entregar `PASS`, `WARN` o `FAIL`.

El objetivo final es que el gate quede sin `WARN` estructurales para producción.

### 5.2 E2E con Playwright

Playwright cubrirá:

- apertura de la landing;
- navegación a demos enlazadas;
- retorno correcto a la landing;
- ausencia de errores de consola;
- ausencia de fallos de red;
- validación de CTAs y flujos clave;
- validación de formularios/modales críticos donde aplique.

La suite debe correr tanto contra servidor local como, cuando corresponda, contra la URL pública.

### 5.3 Lighthouse CI

Se configurarán umbrales estrictos. Objetivo inicial:

- Performance: `>= 85`
- Accessibility: `>= 95`
- Best Practices: `>= 95`
- SEO: `>= 95`

Si la landing o una demo prioritaria cae por debajo, el pipeline falla.

### 5.4 Smoke test de producción

Se añadirá una validación ligera pero bloqueante para la URL pública:

- status `200` en landing;
- título esperado;
- assets críticos accesibles;
- demos clave accesibles;
- ausencia de regresiones evidentes frente a la versión local;
- validación básica de cabeceras y comportamiento de caché cuando aplique.

## 6. Criterios de aprobación

El repo se considerará listo para producción solo si:

- el gate unificado devuelve `PASS`;
- Playwright devuelve `PASS`;
- Lighthouse CI cumple thresholds;
- GitHub Actions queda verde;
- smoke test contra Cloudflare queda verde;
- no hay errores JS ni fallos relevantes de carga;
- no faltan metadatos SEO mínimos.

Un `WARN` solo será aceptable si corresponde a algo explícitamente no bloqueante y documentado. La ausencia de tests versionados no será aceptable.

## 7. Implementación por fases

### Fase 1. Formalizar entorno

- crear `package.json`
- fijar versión de Node
- instalar dependencias
- definir scripts oficiales

### Fase 2. Crear suite real dentro del repo

- reemplazar tests ausentes por tests locales versionados
- consolidar navegación, consola/red y validaciones funcionales

### Fase 3. Integrar Lighthouse

- configurar escenarios a auditar
- fijar thresholds
- ajustar fallos reales del sitio si aparecen

### Fase 4. CI en GitHub Actions

- job de instalación
- job de QA local
- job de Lighthouse
- job de smoke post-deploy o contra preview/producción

### Fase 5. Endurecimiento final

- corregir hallazgos reales
- dejar documentación operativa
- actualizar `AGENTS.md`

## 8. Riesgos y mitigaciones

- **Riesgo:** falsos positivos en validaciones estáticas.
  - Mitigación: separar rutas estáticas de bindings dinámicos.

- **Riesgo:** thresholds de Lighthouse demasiado duros para la primera corrida.
  - Mitigación: medir, corregir, luego fijar thresholds realistas pero exigentes.

- **Riesgo:** dependencia de tests no versionados.
  - Mitigación: mover toda la certificación crítica dentro del repo.

- **Riesgo:** divergencia entre local y producción.
  - Mitigación: smoke test contra Cloudflare y misma suite sobre entorno servido.

## 9. Resultado esperado

Al terminar esta implementación, el proyecto tendrá una base de calidad comparable con un sitio estático production-grade serio:

- ambiente reproducible;
- QA automatizado;
- auditoría de calidad web;
- pipeline bloqueante;
- validación post-deploy.

Ese es el estándar mínimo para sostener confianza comercial de manera defendible.
