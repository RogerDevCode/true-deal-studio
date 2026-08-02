# Visor de contraseña STAX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir un control accesible para mostrar u ocultar contraseñas en los formularios de VoiceLive y VentaMax que todavía no lo tienen.

**Architecture:** Cada formulario conserva su estado de contraseña y suma un booleano local `showPassword`. Un botón explícito `type="button"` cambia únicamente el tipo del input y su etiqueta accesible. No hay cambios de API, autenticación, validaciones ni persistencia.

**Tech Stack:** React 19, TypeScript, Vite/Vitest (VoiceLive), Next.js 15, Lucide React, pnpm (VentaMax).

## Global Constraints

- Contraseñas ocultas por defecto y `autocomplete` sin cambios.
- Botón con icono, tooltip, foco visible y `aria-label` dinámico.
- Revelar no envía el formulario ni altera su valor.
- Resetear a oculto sólo después de un envío exitoso o al desmontar el formulario.
- True Deal no cambia: no posee formularios de autenticación propios.
- Preservar cambios ajenos no relacionados en VentaMax.

---

### Task 1: Añadir visor a VoiceLive

**Files:**
- Modify: `/home/manager/Sync/python_proyects/voicelive-v2/frontend/src/auth/LoginForm.tsx`
- Modify: `/home/manager/Sync/python_proyects/voicelive-v2/frontend/src/admin/TenantCreator.tsx`
- Modify: `/home/manager/Sync/python_proyects/voicelive-v2/frontend/src/styles.css` o la hoja que define `.field` y `.form-grid__wide`

**Interfaces:**
- Consumes: estado local de React y `onSubmit(email, password)` existente.
- Produces: inputs `type={showPassword ? "text" : "password"}` y botones de alternancia sin cambios a las props públicas.

- [ ] **Step 1: Añadir estado y botón al login**

```tsx
const [showPassword, setShowPassword] = useState(false);

<div className="password-field">
  <input type={showPassword ? "text" : "password"} /* props existentes */ />
  <button
    type="button"
    className="password-toggle"
    onClick={() => setShowPassword((visible) => !visible)}
    aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
    title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
  >
    {showPassword ? "Ocultar" : "Ver"}
  </button>
</div>
```

- [ ] **Step 2: Ocultar después de autenticar correctamente**

Cambiar `submit` para que `setShowPassword(false)` ocurra sólo después de que
`await onSubmit(email, password)` termine sin lanzar error.

- [ ] **Step 3: Repetir el patrón en TenantCreator**

Agregar `showOwnerPassword`; conservar `required`, límites y
`autoComplete="new-password"`. Al crear el tenant satisfactoriamente, ocultar
la contraseña antes de restablecer el formulario existente.

- [ ] **Step 4: Aplicar estilo sin solapar texto ni foco**

```css
.password-field { position: relative; }
.password-field input { padding-right: 5.5rem; }
.password-toggle { position: absolute; right: .5rem; top: 50%; transform: translateY(-50%); }
```

Usar los tokens, bordes y foco existentes; el control se mantiene usable a
200% de zoom y por teclado.

- [ ] **Step 5: Validar VoiceLive**

Run: `npm run typecheck && npm run test && npm run build`

Expected: PASS, y comprobación manual: al escribir una contraseña, el botón
alterna el tipo, conserva el valor y no dispara el submit.

- [ ] **Step 6: Commit**

```bash
git -C /home/manager/Sync/python_proyects/voicelive-v2 add frontend/src/auth/LoginForm.tsx frontend/src/admin/TenantCreator.tsx frontend/src/styles.css
git -C /home/manager/Sync/python_proyects/voicelive-v2 commit -m "feat: agregar visor de contrasena en VoiceLive"
```

### Task 2: Completar visor de inicio de sesión en VentaMax

**Files:**
- Modify: `/home/manager/Sync/python_proyects/venta-max-ia/src/app/(auth)/login/login-client.tsx`
- Test: `/home/manager/Sync/python_proyects/venta-max-ia` scripts de lint, typecheck y test existentes

**Interfaces:**
- Consumes: `signIn.email({ email, password })` y componentes `Input`, `Button` existentes.
- Produces: inicio de sesión con control local `showPassword`; no cambia payload ni respuesta.

- [ ] **Step 1: Añadir iconos y estado**

```tsx
import { Eye, EyeOff } from "lucide-react";

const [showPassword, setShowPassword] = useState(false);
```

- [ ] **Step 2: Envolver input y añadir botón accesible**

```tsx
<div className="relative">
  <Input
    id="password"
    type={showPassword ? "text" : "password"}
    className="pr-10"
    /* props existentes */
  />
  <button
    type="button"
    onClick={() => setShowPassword((visible) => !visible)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
    title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
  >
    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
  </button>
</div>
```

- [ ] **Step 3: Restablecer sólo tras login exitoso**

Antes de `router.push("/inbox")`, añadir `setShowPassword(false)`. No tocar el
estado si `signIn.email` devuelve error.

- [ ] **Step 4: Validar VentaMax sin modificar archivos ajenos**

Run: `pnpm lint && pnpm typecheck && pnpm test`

Expected: PASS. Ejecutar `git status --short` antes y después, y agregar sólo
el archivo de login al commit porque el repositorio ya contiene cambios ajenos.

- [ ] **Step 5: Commit**

```bash
git -C /home/manager/Sync/python_proyects/venta-max-ia add 'src/app/(auth)/login/login-client.tsx'
git -C /home/manager/Sync/python_proyects/venta-max-ia commit -m "feat: agregar visor de contrasena en login"
```

### Task 3: Verificación integrada

**Files:**
- Uses: los formularios actualizados de VoiceLive y VentaMax.

**Interfaces:**
- Consumes: los servicios locales ya levantados.
- Produces: evidencia de que los formularios continúan disponibles después de build y reinicio Docker.

- [ ] **Step 1: Reconstruir los dos servicios afectados**

Run: `docker compose -f /home/manager/Sync/python_proyects/voicelive-v2/compose.yaml up -d --build` y `docker compose -f /home/manager/Sync/python_proyects/venta-max-ia/docker-compose.yml up -d --build`.

- [ ] **Step 2: Confirmar salud y navegación**

Run: `curl --fail http://127.0.0.1:5173/`, `curl --fail http://127.0.0.1:8000/api/v1/ready` y `curl --fail http://127.0.0.1/login`.

Expected: respuestas 200; los campos son inicialmente secretos y se pueden
revelar mediante su botón sin enviar el formulario.
