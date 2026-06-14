# Guía de Proyecto: Showcase de Sitios Web para el Mercado Chileno

Este archivo documenta la estructura, las características técnicas, las decisiones de diseño y el entorno de pruebas de este proyecto para facilitar el mantenimiento y la evolución por parte de futuros desarrolladores o agentes de IA.

---

## 1. Resumen y Objetivos del Proyecto

El objetivo de este proyecto es promocionar servicios de desarrollo de software y diseño web para PYMEs en Chile. Para lograrlo, el sitio principal funciona como una **Landing Page de Conversión** que incluye un catálogo interactivo de **5 sitios web de demostración** altamente optimizados y adaptados a sectores típicos del comercio local chileno.

Cada uno de los sitios de demostración fue construido bajo estándares premium de diseño, con micro-animaciones fluidas (usando CSS Vainilla y transiciones aceleradas por hardware), interactividad dinámica con Alpine.js y optimización básica para SEO y accesibilidad.

---

## 2. Estructura del Repositorio

```bash
/web_promotion
├── AGENTS.md                          # Esta guía de arquitectura y desarrollo
├── index.html                         # Landing page principal (Dracula Dark Theme)
├── investigacion_diseños_populares.md # Estudio de patrones de diseño preferidos en Chile
├── research_sitios_web_chile.md       # Análisis de mercado y competidores locales
│
├── demo-psicologa/                    # Demo 1: Psicóloga Clínica (Clara Altieri)
│   ├── index.html                     # Estructura limpia y minimalista (Sage/Sand)
│   └── preview.png                    # Captura de pantalla de previsualización
│
├── demo-cafe-valparaiso/              # Demo 2: Café de Especialidad (Café La Ruta)
│   ├── index.html                     # Bento grid, carta interactiva y simulador
│   ├── hero.png, coffee.png, etc.     # Recursos e imágenes locales
│   └── cazuela.png, exterior.png
│
├── demo-salon-belleza/                # Demo 3: Alta Peluquería (Studio Chic)
│   ├── index.html                     # Split-screen, deslizador antes/después, Valentina Moretti
│   └── hero.png, before.png, etc.     # Recursos e imágenes locales
│
├── demo-artesanias/                   # Demo 4: Retail & E-commerce (Artesanías del Sur)
│   ├── index.html                     # Carrito asincrónico y checkout a WhatsApp
│   └── studio.png, greda.png, etc.    # Recursos e imágenes locales
│
├── demo-contabilidad/                 # Demo 5: Portal de Servicios B2B (ContaDigital)
│   ├── index.html                     # Calculadora dinámica de planes SII
│   └── office.png, portrait.png       # Recursos e imágenes locales
│
├── demo-propiedades/                  # Demo 6: Corredora de Propiedades (Cobre & Co.)
│   ├── index.html                     # Filtros en UF/CLP y Agenda de Visitas
│   └── depto1.png, hero.png, etc.     # Recursos e imágenes locales
│
├── demo-ecommerce-tech/               # Demo 7: Tienda Auto-Administrable (Apex Tech)
│   ├── index.html                     # E-commerce interactivo con panel de pedidos
│   └── hero.png, product_*.png        # Recursos e imágenes locales
│
└── demo-agenda/                       # Demo 8: CRM Express (Gestor de Citas y Clientes)
    └── index.html                     # Tablero centralizado de reservas de los demos
```

---

## 3. Directrices y Reglas Técnicas Críticas

Para mantener la integridad del sistema, cualquier cambio posterior debe respetar las siguientes especificaciones técnicas:

### A. Compatibilidad Sin Conexión (Protocolo `file://`)
*   **Regla**: Los enlaces de navegación entre carpetas deben apuntar explícitamente al archivo de destino (`./demo-nombre/index.html`) en lugar de depender de la resolución automática del directorio (`./demo-nombre/`).
*   **Razón**: Permite que el usuario final previsualice y navegue por las demos haciendo doble clic en el archivo local `index.html` directamente desde su explorador de archivos, sin necesidad de levantar un servidor HTTP.

### B. Comportamiento y Limpieza de Formularios (Alpine.js)
*   **Regla**: Todos los modales de contacto/reserva (en Demos 1, 2, 3, 5 y Carro en Demo 4) deben resetear su estado al 100% al cancelarse, enviarse o cerrarse. No se permite mantener datos anteriores en caché o memoria.
*   **Implementación**: Se utiliza una función de reset (`resetForm()`) gatillada mediante eventos y reactividad con `x-effect` para limpiar todas las variables reactivas a su estado original (`''` o `null`).

### C. Prioridad de Canales de Atención
*   **Regla**: En todos los selectores de modalidad de atención, reserva de horas o despacho, la opción **"Presencial"** debe ser listada en primer lugar y estar seleccionada por defecto en el estado del componente.

### D. Mapas de Google Integrados
*   **Regla**: Las URLs de los mapas de Google en formato iframe deben usar exclusivamente el delimitador de exclamación `!` para separar parámetros en la cadena `pb` (ej. `!1i1024!2i768` en lugar de la barra `|` que arroja errores de rechazo en Google Maps Platform).

### E. Uso de Clases CSS Específicas
*   **Regla**: En vez de usar `!important`, usa clases CSS específicas para cada caso específico.
*   **Razón**: Mantiene la predictibilidad de la cascada CSS y facilita el mantenimiento y escalabilidad del diseño sin generar colisiones de especificidad. Se exceptúan únicamente los casos estructurales de librerías como Alpine.js (`[x-cloak] { display: none !important; }`) o resets de accesibilidad (`prefers-reduced-motion`).

---

## 4. Estrategia de SEO & Accesibilidad

Cada página implementa las mejores prácticas básicas de SEO sin alterar la estética visual de las plantillas:
1.  **Idioma Localizado**: Etiqueta `<html>` configurada en `lang="es-CL"` en todas las páginas.
2.  **Encabezados Jerárquicos**: Exactamente una etiqueta `<h1>` por página, seguida de una estructura lógica de `<h2>` y `<h3>`.
3.  **Metadatos de Compartición (Open Graph & Twitter)**: Etiquetas `og:title`, `og:description`, `og:image`, `og:type` y `twitter:card` con formato `summary_large_image` integradas en los `<head>`.
4.  **Datos Estructurados (JSON-LD)**: Schema markup adaptado al tipo de negocio para facilitar la indexación local:
    *   *Principal*: `WebSite`
    *   *Psicóloga*: `MedicalBusiness`
    *   *Café*: `CafeOrCoffeeShop`
    *   *Salón*: `BeautySalon`
    *   *Artesanías*: `Store`
    *   *Contabilidad*: `AccountingService`
5.  **Favicons Livianos**: Favicons dinámicos basados en vectores SVG con emojis (🌸, ☕, ✨, 🏺, 💼, 🚀), lo que evita peticiones fallidas 404 al servidor y agiliza la carga offline.

---

## 5. Entorno de Pruebas (Automatización)

Para validar el funcionamiento del sistema, se cuenta con scripts de prueba basados en **Puppeteer** localizados en el directorio temporal o de scratch de la aplicación. Estos scripts pueden ser ejecutados de la siguiente forma:

```bash
# Validar la página de inicio y sus enlaces
node test_root.js

# Validar interactividad, cálculo de tarifas y reset de modales en las demos
node test_cafe.js
node test_salon.js
node test_artesanias.js
node test_contabilidad.js

# Auditar errores o warnings de consola y peticiones fallidas de red
node check_consoles.js
```

> [!IMPORTANT]
> Antes de realizar un despliegue a producción, es obligatorio ejecutar `node check_consoles.js` y confirmar que no existan errores de scripts o warnings de dependencias de Alpine.js (como el requerimiento del plugin `collapse` para animaciones `x-collapse`).
