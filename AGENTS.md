# True Deal Studio — Manual Operativo

## 0. Ficha rápida para agentes

- **Producto:** Tu Vitrina Web, vitrina comercial y punto de entrada público del megaproyecto.
- **Runtime:** sitio estático, compatible con `file://`; Docker local publica `http://127.0.0.1:8081`.
- **No es fuente de verdad de datos operativos:** no guarda reservas, conversaciones ni pedidos.
- **Integraciones:** abre el widget público de VoiceLive y el canal público de VentaMax IA mediante URLs declaradas.
- **Repositorio hermano de voz:** `/home/manager/Sync/python_proyects/voicelive-v2`.
- **Repositorio hermano conversacional:** `/home/manager/Sync/python_proyects/venta-max-ia`.
- **Manuales centrales:** `docs/manuales/MANUAL-ADMINISTRADOR-STAX.md` y
  `docs/manuales/MANUAL-TENANT-STAX.md`.
- **Gate obligatorio:** `npm run qa:gate`; no aprobar despliegue si no termina en `PASS`.

## 1. Contexto

Este repositorio contiene una landing de servicios web para PYMEs, MIPYMEs y emprendimientos chilenos, junto con 14 demostraciones interactivas.

La propuesta comercial vigente es: **“Que te vean. Que te crean.”** La página presenta productos o servicios, valores desde, horarios, cobertura, delivery, reservas y el siguiente paso para que las consultas lleguen con contexto.

El público principal vende de forma presencial, por delivery o mediante WhatsApp; suele tener presencia digital limitada y busca claridad, control y alcance visible.

La marca visible del proyecto es **Tu Vitrina**. **True Deal Studio** identifica el repositorio y su evolución estratégica.

## 2. Stack

- HTML estático y CSS local.
- Tailwind CSS compilado en `assets/css/tailwind.css`.
- Alpine.js local en `assets/vendor/` para interactividad.
- Node.js `>=22 <23`.
- Playwright para pruebas E2E.
- Chrome Headless para validación real bajo `file://`.

El proyecto prioriza recursos locales y funcionamiento offline.

## 3. Mapa del repositorio

```text
index.html                         Landing principal
privacidad.html                    Aviso de privacidad
assets/                            CSS, fuentes, imágenes y librerías locales
demo-*/                            14 demostraciones interactivas
tests/                             Pruebas Playwright
scripts/                           Gate, servidor estático y helpers
docs/                              Documentación y planes
docs/plans/                        Planes de implementación
docs/superpowers/specs/            Especificaciones aprobadas
README.md                          Guía para GitHub
package.json                       Scripts Node.js y dependencias
playwright.config.js               Configuración de Playwright
```

### Demos

- `demo-fonoaudiologia`, `demo-psicologa`: salud y reservas.
- `demo-cafe-valparaiso`, `demo-salon-belleza`: atención local y agenda.
- `demo-artesanias`, `demo-ecommerce-tech`: catálogo, pedidos y e-commerce.
- `demo-contabilidad`, `demo-agenda`, `demo-propiedades`: servicios, gestión y visitas.
- `demo-plan-profesional`, `demo-plan-premium`: propuestas de plan y checkout.
- `demo-propuesta-empezar-simple`, `demo-propuesta-atencion-ordenada`, `demo-propuesta-impacto-comercial`: rutas comerciales de referencia.

## 4. Reglas obligatorias

### Navegación offline

- Mantener compatibilidad con `file://`.
- Usar rutas explícitas al archivo destino: `./demo-nombre/index.html` y `../index.html`.
- Mantener recursos locales; comprobar enlaces después de cambiar rutas, demos o assets.

### Formularios y atención

- Los modales de reserva/contacto de las demos deben restablecer el estado al cancelar, enviar o cerrar.
- En selectores de modalidad, reserva o despacho, **Presencial** aparece primero y queda seleccionada por defecto.
- Conservar validaciones, accesibilidad, mensaje prellenado y fallback de WhatsApp al modificar formularios.

### CSS e interactividad

- Usar clases CSS específicas; reservar `!important` para `[x-cloak]` y `prefers-reduced-motion`.
- Conservar Alpine.js local y plugins requeridos, como `alpine-collapse.min.js` cuando exista `x-collapse`.
- Respetar `prefers-reduced-motion`, contraste, foco visible y comportamiento responsive.
- **Ergonomía visual y tamaño mínimo de fuente:** Pensando en usuarios mayores de 30 y 50+ años (prevención de presbicia y fatiga visual), el tamaño de fuente mínimo permitido en cualquier vista, componente o dispositivo es **13px / 14px** (`text-sm` o `0.8125rem`/`0.875rem`). Queda estrictamente prohibido usar fuentes micro de `10px` o `11px`. Asimismo, se exige alto contraste de color (mínimo 7:1 en modo oscuro y 4.5:1 en modo claro); se prohíben textos en gris opaco sobre fondos azulados u oscuros.

### Google Maps

- En URLs iframe de Google Maps, separar parámetros de `pb` con `!`.

### Python, Ruff y Mypy (Backend)

- **Excepciones múltiples:** Al usar un bloque `except` con múltiples excepciones, SIEMPRE debes asignar la tupla a una variable (ej. `except (ErrorA, ErrorB) as _e:`). Si no lo haces, `ruff format` considerará los paréntesis redundantes y los eliminará, lo cual genera un error de sintaxis duro en `mypy` (`Multiple exception types must be parenthesized`).

### SEO y accesibilidad

Cada página pública mantiene:

- `lang="es-CL"`.
- Un único `<h1>` y jerarquía lógica de encabezados.
- `og:title`, `og:description`, `og:image`, `og:type` y `twitter:card="summary_large_image"`.
- JSON-LD acorde al negocio o `WebSite` para la landing.
- Texto alternativo útil y controles con etiquetas accesibles.

### Copy y propuesta comercial

- Usar español directo, afirmativo y orientado a acciones observables: mostrar, explicar, orientar, preparar, ordenar, revisar y avanzar.
- Cuando un titular presente dos ideas completas, disponer cada idea en su propia línea mediante un bloque explícito; evitar que el ajuste automático las una o corte una idea a la mitad.
- Tratar la IA como herramienta de apoyo; explicar el aporte humano en criterio, adaptación, publicación e integración con la atención del negocio.
- Presentar las demos como evidencia de criterio: qué ordenan y qué puede revisar el dueño.
- Mostrar alcance, valor, plazos, accesos, dominio, contenidos y propiedad de forma clara.

## 5. Prohibiciones

- Atribuir testimonios, ventas, conversiones o resultados a clientes inexistentes.
- Prometer ventas garantizadas o presentar la página como sustituto de una operación comercial.
- Enlazar, integrar o modificar `voiceshop-pro.zip` sin instrucción explícita del usuario.
- Agregar CDN, fuentes remotas o dependencias que afecten compatibilidad `file://`.
- Alterar rutas relativas de demos sin actualizar y validar sus enlaces.
- Usar `!important` como solución general de estilo.
- Ejecutar comandos destructivos de Git o eliminar assets/documentos fuera del alcance pedido.
- Cambiar configuraciones, credenciales, dominios o servicios externos sin autorización explícita.

## 6. Flujo de trabajo

1. Revisar `git status --short`, `AGENTS.md`, archivos relacionados y pruebas existentes.
2. Para cambios de producto o copy, revisar primero la especificación y el plan aplicables en `docs/`.
3. Reutilizar patrones, estilos y componentes existentes antes de añadir código o dependencias.
4. **LEY ESTRICTA DE MIGRACIONES**: En los repositorios hermanos con base de datos, al modificar esquemas o modelos siempre se debe correr el comando para crear el archivo de migración que actualiza la DB de producción.
5. Mantener cambios focalizados; agregar o ajustar pruebas cuando cambie el comportamiento.
6. Ejecutar la validación proporcional al cambio.

Preferir ejecución directa a usar agentes, salvo cuando una tarea especializada se beneficie claramente de esa colaboración.

## 7. Instalación y QA

```bash
# Dependencias reproducibles
npm ci

# Servidor local opcional
npm run serve

# Puerta de preproducción: static checks, Playwright y navegación file://
npm run qa:gate

# Pruebas focalizadas
npm run test_root
npm run test_cafe
npm run test_salon
npm run test_artesanias
npm run test_contabilidad
npm run check_consoles

# Suite Playwright completa
npm run qa:e2e
```

Antes de aprobar despliegue, `npm run qa:gate` debe finalizar en `PASS`. El gate valida SEO, recursos locales, enlaces `file://`, formularios, consola, red y navegación de demos.

## 8. Documentación y Git

- Documentación general: `docs/`.
- Planes: `docs/plans/`.
- Especificaciones: `docs/superpowers/specs/`.
- Bitácoras: `doc/logs/`.
- Helpers reutilizables: `scripts/`; borrar helpers de una sola ejecución al finalizar.

Antes de editar, preservar cambios ajenos presentes en el worktree. Usar commits focalizados y descriptivos. Publicar al remoto solo cuando la tarea o el usuario lo autorice.

## 9. Referencias actuales

- [README.md](README.md)
- [Arquitectura del megaproyecto](docs/STAX-MEGAPROYECTO.md)
- [Manual del administrador](docs/manuales/MANUAL-ADMINISTRADOR-STAX.md)
- [Manual del tenant](docs/manuales/MANUAL-TENANT-STAX.md)
- [Propuesta WhatsApp-first](docs/superpowers/specs/2026-07-18-propuesta-whatsapp-clara-design.md)
- [Plan de implementación](docs/plans/2026-07-18-implementacion-oferta-clara-whatsapp.md)

## 10. TODOs Futuros (Roadmap Multi-Vendedor)

- [x] **Bandeja aislada (Vendedor solo ve SUS clientes):**
  - **Schema / BD:** Agregar columna `assigned_user_id` en las entidades `conversation`, `contact` y `lead`.
  - **Filtro por Rol:** Ajustar consultas ORM (`scoped(organization_id)`) para que los usuarios con rol `seller`/`member` vean únicamente sus asignaciones, manteniendo vista global solo para `owner`/`admin`.

## 11. Megaproyecto Tu Vitrina

Por instrucción explícita del usuario, este repositorio forma parte del megaproyecto junto con:

- `true-deal-studio`: landing comercial y punto de entrada público de `tuvitrina.lat`.
- `/home/manager/Sync/python_proyects/voicelive-v2`: orientación pública por texto y voz (VoiceLive).
- `/home/manager/Sync/python_proyects/venta-max-ia`: operación conversacional y continuidad humana por Telegram.

Los tres repositorios entregan una sola oferta: **la web explica, la voz orienta y el dueño decide el siguiente paso**. Cada repositorio conserva su historial, runtime, pruebas, secretos y despliegue independientes; **el desarrollo de cada proyecto es individual, por lo que mantienen carpetas separadas y dockers separados**. No se fusionan imágenes, bases de datos ni credenciales sin una tarea explícita.

Al trabajar en una capacidad transversal autorizada por el usuario, revisar los tres contratos y la guía compartida `docs/STAX-MEGAPROYECTO.md`. Declarar los contratos entre componentes (URL pública, payload, autenticación, responsable y prueba) antes de modificar una integración. Los cambios internos siguen limitados a este repositorio salvo autorización explícita para editar los demás.

### Contratos y fuentes de verdad

- La landing controla copy, demos, enlaces, SEO y experiencia de entrada.
- VoiceLive controla horarios, solicitudes, reservas, memoria consentida y FAQ de voz.
- VentaMax IA controla conversaciones Telegram, contactos, catálogo, pipeline y pedidos.
- Google Calendar es una proyección de salida de VoiceLive; no se consulta como fuente de disponibilidad.
- Un enlace externo debe tener fallback comprensible. No ocultar una caída de túnel ni prometer atención inmediata.
- Cualquier cambio transversal debe probar al menos origen, navegación, destino, error del destino y recuperación.

### Tolerancia cero a errores silenciosos
- **Los errores no deben pasar silenciosamente.** Todo error en integraciones externas (como caídas de red, ETIMEDOUT con Telegram, respuestas 404 en webhooks, o fallos de autenticación) debe ser capturado, registrado explícitamente en la base de datos (ej. `last_error` en la tabla de outbox/receipt) y alertado al sistema de logs de la aplicación.
- Nunca se debe abortar una promesa de fondo o cola de mensajes sin dejar un registro claro del motivo del fallo.
