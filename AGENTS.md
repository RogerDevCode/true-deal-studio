# True Deal Studio — Manual Operativo

## 1. Contexto

Este repositorio contiene una landing de servicios web para PYMEs, MIPYMEs y emprendimientos chilenos, junto con 14 demostraciones interactivas.

La propuesta comercial vigente es: **“Muestra lo que haces. Atiende mejor por WhatsApp.”** La página presenta productos o servicios, valores desde, horarios, cobertura, delivery, reservas y el siguiente paso para que las consultas lleguen con contexto.

El público principal vende de forma presencial, por delivery o mediante WhatsApp; suele tener presencia digital limitada y busca claridad, control y alcance visible.

La marca visible actual de la landing es **STAX**. **True Deal Studio** identifica el repositorio y su evolución estratégica. Un rebranding público requiere una tarea coordinada que incluya identidad, textos, SEO, metadatos y material relacionado.

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

### Google Maps

- En URLs iframe de Google Maps, separar parámetros de `pb` con `!`.

### SEO y accesibilidad

Cada página pública mantiene:

- `lang="es-CL"`.
- Un único `<h1>` y jerarquía lógica de encabezados.
- `og:title`, `og:description`, `og:image`, `og:type` y `twitter:card="summary_large_image"`.
- JSON-LD acorde al negocio o `WebSite` para la landing.
- Texto alternativo útil y controles con etiquetas accesibles.

### Copy y propuesta comercial

- Usar español directo, afirmativo y orientado a acciones observables: mostrar, explicar, orientar, preparar, ordenar, revisar y avanzar.
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
4. Mantener cambios focalizados; agregar o ajustar pruebas cuando cambie el comportamiento.
5. Ejecutar la validación proporcional al cambio.

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
- [Propuesta WhatsApp-first](docs/superpowers/specs/2026-07-18-propuesta-whatsapp-clara-design.md)
- [Plan de implementación](docs/plans/2026-07-18-implementacion-oferta-clara-whatsapp.md)
