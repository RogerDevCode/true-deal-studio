# Despliegue automático GitHub–Vercel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar una guía precisa para conectar este sitio estático a Vercel mediante GitHub, con Preview Deployments para pull requests y producción automática desde `main`.

**Architecture:** La integración nativa de Vercel se configura una sola vez en el Dashboard y detecta el `index.html` de la raíz. El repositorio conserva `vercel.json` para cache, cabeceras y el rewrite del favicon; el README documenta los únicos ajustes externos necesarios sin almacenar credenciales ni identificadores de proyecto.

**Tech Stack:** Vercel Git Integration, GitHub, HTML estático, JSON, GitHub Actions.

## Global Constraints

- Usar integración nativa GitHub–Vercel; no agregar GitHub Actions de despliegue ni secretos `VERCEL_*`.
- Mantener `main` como Production Branch.
- Configurar el proyecto como sitio estático: Framework Preset `Other`, Build Command vacío y Output Directory vacío.
- Conservar `vercel.json` y `.vercelignore` como configuraciones del despliegue.
- No modificar el comportamiento offline `file://`, las demos ni el QA existente.

---

## File Structure

- `README.md`: sección operativa para el enlace inicial con Vercel y la verificación de Preview/Production.
- `vercel.json`: configuración existente validada como JSON, sin cambios funcionales requeridos.
- `.vercelignore`: filtro existente de archivos no productivos, sin cambios funcionales requeridos.

### Task 1: Documentar la vinculación nativa GitHub–Vercel

**Files:**
- Modify: `README.md` después de `## Inicio local`

**Interfaces:**
- Consumes: repositorio remoto `RogerDevCode/true-deal-studio`, `vercel.json` y `.vercelignore` existentes.
- Produces: instrucciones para crear el proyecto Vercel y reconocer los deployments automáticos sin usar Vercel CLI ni secretos.

- [ ] **Step 1: Agregar la sección de despliegue**

Insertar esta sección antes de `## Calidad y pruebas`:

```markdown
## Despliegue automático en Vercel

El proyecto ya incluye `vercel.json` y `.vercelignore` para servir el sitio estático desde la raíz. La conexión con Vercel se realiza una sola vez desde la cuenta propietaria:

1. En [Vercel](https://vercel.com/new), selecciona **Add New → Project** e importa `RogerDevCode/true-deal-studio` desde GitHub.
2. Confirma **Framework Preset: Other**, **Root Directory: `./`**, **Build Command: vacío** y **Output Directory: vacío**.
3. Verifica que **Production Branch** sea `main` y selecciona **Deploy**.

Desde ese momento, un push a `main` publica producción automáticamente. Cada pull request o rama distinta de `main` recibe una **Preview URL** para revisión; el enlace aparece en GitHub y en el Dashboard de Vercel.

No agregues tokens, `VERCEL_ORG_ID` ni `VERCEL_PROJECT_ID` al repositorio: la integración GitHub–Vercel gestiona esa autorización fuera del código.
```

- [ ] **Step 2: Confirmar que la guía coincide con la configuración**

Run:

```bash
node -e "JSON.parse(require('node:fs').readFileSync('vercel.json', 'utf8')); console.log('vercel.json: valid JSON')"
rg -n "Despliegue automático en Vercel|Production Branch|Preview URL|VERCEL_ORG_ID" README.md
```

Expected: `vercel.json: valid JSON` y cuatro coincidencias en el README.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: document Vercel GitHub auto deploy"
```

### Task 2: Verificar los archivos de plataforma y publicar

**Files:**
- Test: `vercel.json`
- Test: `.vercelignore`

**Interfaces:**
- Consumes: configuración existente y la guía de Task 1.
- Produces: configuración de Vercel validada y cambios publicados en `main`.

- [ ] **Step 1: Validar JSON y exclusiones**

Run:

```bash
node -e "JSON.parse(require('node:fs').readFileSync('vercel.json', 'utf8')); console.log('vercel.json: valid JSON')"
rg -n "^(docs/|tests/|scripts/|node_modules/)$" .vercelignore
```

Expected: JSON válido y coincidencias para `docs/`, `tests/` y `scripts/`; `node_modules/` puede omitirse porque Vercel no lo incluye desde Git.

- [ ] **Step 2: Ejecutar el gate técnico local**

Run:

```bash
npm run qa:gate
```

Expected: resumen final `PASS`.

- [ ] **Step 3: Publicar en la rama de producción**

Run:

```bash
git push origin HEAD:refs/heads/main
```

Expected: push exitoso. Después de importar el repositorio una vez en Vercel, este push activa la publicación de producción.

## Self-Review

- Cobertura de spec: Task 1 documenta la importación, los ajustes estáticos, `main`, previews y el límite de credenciales; Task 2 comprueba los archivos de plataforma y el gate existente.
- Placeholder scan: no contiene `TBD`, `TODO`, “implement later”, ni instrucciones ambiguas.
- Consistencia: `main`, `Other`, `./`, Build Command vacío y Output Directory vacío se mantienen iguales en objetivo, restricciones y pasos.
