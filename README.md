# True Deal Studio

Landing de servicios web para PYMEs, MIPYMEs y emprendimientos chilenos. Su propuesta es simple: **que te vean. Que te crean.**

El sitio presenta páginas web como una herramienta comercial concreta: explica productos o servicios, valores desde, horarios, cobertura, delivery, reservas y el siguiente paso antes de iniciar una conversación. El foco está en recibir consultas con contexto y dar al dueño mayor claridad sobre su atención digital.

## Qué incluye

- Landing principal orientada a negocios locales, servicios y delivery.
- Catálogo de 14 demostraciones interactivas para rubros frecuentes en Chile.
- Escalera de servicios: página de oferta, catálogo o reservas y e-commerce.
- Contacto por WhatsApp con mensaje prellenado.
- Compatibilidad local mediante `file://`.
- SEO base, Open Graph, Twitter Cards y datos estructurados JSON-LD.
- Diseño responsive, Alpine.js y recursos locales.

## Demostraciones

| Categoría | Demo | Enfoque |
| --- | --- | --- |
| Salud | Fonoaudiología, Psicóloga Clínica | Servicios, modalidad y reservas. |
| Gastronomía | Café de Especialidad | Carta, valores, horarios y pedidos. |
| Belleza | Salón de Belleza | Servicios, estilo y agenda. |
| Comercio | Artesanías, Apex Tech | Catálogo, carrito, pedidos y e-commerce. |
| Servicios | ContaDigital, CRM Express | Planes, valores, agenda y seguimiento. |
| Inmobiliario | Cobre & Co. Propiedades | Búsqueda, precio y agendamiento de visitas. |
| Propuestas | Empezar Simple, Atención Ordenada, Impacto Comercial | Distintas rutas de presentación comercial. |
| Planes | Plan Profesional, Plan Premium | Catálogo, cotización, pagos y checkout. |

La landing enlaza cada demo con una ruta relativa explícita, por ejemplo `./demo-cafe-valparaiso/index.html`, para permitir navegación local desde el explorador de archivos.

## Inicio local

### Vista directa

Abre `index.html` con tu navegador. La landing y sus demostraciones están preparadas para funcionar con `file://`.

### Servidor estático

Requiere Node.js 22.

```bash
npm ci
npm run serve
```

El servidor se inicia en `http://localhost:4173` de forma predeterminada.

## Despliegue automático en Vercel

El proyecto ya incluye `vercel.json` y `.vercelignore` para servir el sitio estático desde la raíz. La conexión con Vercel se realiza una sola vez desde la cuenta propietaria:

1. En [Vercel](https://vercel.com/new), selecciona **Add New → Project** e importa `RogerDevCode/true-deal-studio` desde GitHub.
2. Confirma **Framework Preset: Other**, **Root Directory: `./`**, **Build Command: vacío** y **Output Directory: vacío**.
3. Verifica que **Production Branch** sea `main` y selecciona **Deploy**.

Desde ese momento, un push a `main` publica producción automáticamente. Cada pull request o rama distinta de `main` recibe una **Preview URL** para revisión; el enlace aparece en GitHub y en el Dashboard de Vercel.

No agregues tokens, `VERCEL_ORG_ID` ni `VERCEL_PROJECT_ID` al repositorio: la integración GitHub–Vercel gestiona esa autorización fuera del código.

## Calidad y pruebas

El proyecto usa Playwright para validar formularios, navegación, consola y comportamiento de la landing.

```bash
# Puerta completa: checks estáticos, pruebas y navegación offline
npm run qa:gate

# Landing y enlaces de demos
npm run test_root

# Formularios de demostraciones
npm run test_cafe
npm run test_salon
npm run test_artesanias
npm run test_contabilidad

# Consola y red
npm run check_consoles

# Suite Playwright completa
npm run qa:e2e

# Smoke contra el despliegue vigente en Vercel
npm run qa:prod-smoke
```

`scripts/preproduction_gate.js` valida idioma `es-CL`, jerarquía de encabezados, Open Graph, Twitter Cards, JSON-LD, recursos locales, enlaces `file://`, consola y navegación de las demostraciones.

El smoke comprueba la landing, privacidad y las 14 demostraciones contra `https://true-deal-studio.vercel.app/`.

## Estructura

```text
.
├── index.html                         # Landing principal
├── privacidad.html                    # Aviso de privacidad
├── demo-*/                            # Demostraciones por rubro y plan
├── assets/                            # CSS, fuentes, imágenes y Alpine.js local
├── tests/                             # Pruebas Playwright
├── scripts/                           # QA, servidor estático y helpers
├── docs/                              # Documentación, planes y especificaciones
├── AGENTS.md                          # Reglas técnicas y de mantenimiento
├── package.json                       # Comandos Node.js y dependencias
└── playwright.config.js               # Configuración de Playwright
```

## Principios del proyecto

- Comunicación directa para negocios que venden de forma presencial, por delivery o WhatsApp.
- Precios, alcance, plazos, accesos y propiedad explicados con claridad.
- La IA funciona como herramienta de apoyo; el servicio aporta criterio, implementación y una página adaptada a la atención real del negocio.
- Cada demo presenta una forma de ordenar información antes de la conversación comercial.
- Recursos y enlaces locales para una experiencia offline confiable.

## Documentación

- [Guía del proyecto](AGENTS.md)
- [Diseño de propuesta WhatsApp-first](docs/superpowers/specs/2026-07-18-propuesta-whatsapp-clara-design.md)
- [Plan de implementación](docs/plans/2026-07-18-implementacion-oferta-clara-whatsapp.md)

## Stack

HTML, CSS, Alpine.js, Node.js y Playwright.
