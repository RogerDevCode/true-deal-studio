# Auditoría de Calidad de Código Thermo-Nuclear (web_promotion)

Este análisis evalúa el estado del proyecto bajo los estrictos estándares de la directiva **thermo-nuclear-code-quality-review**, enfocándose en la legibilidad, modularidad, consistencia del diseño y duplicación de componentes en las distintas demos web.

---

## 📋 Diagnóstico General y Métricas Clave

| Métrica | Valor Encontrado | Umbral Thermo-Nuclear | Estado |
| :--- | :--- | :--- | :---: |
| **Archivos > 1,000 líneas** | **7 archivos** (`index.html` y 6 demos) | 0 (Recomendado fragmentar) | ⚠️ **Smell** |
| **Líneas del archivo más grande** | **2,403 líneas** (`demo-plan-premium/index.html`) | < 1,000 líneas | ⚠️ **Smell** |
| **Framework CSS** | Tailwind CSS CDN + Vanilla CSS Variables | Consistencia de capa |  **OK** |
| **Framework JS** | Alpine.js reactivo en HTML | Lógica modular / Desacoplada | ⚠️ **Nit** |

---

##  Hallazgos y Observaciones Estructurales

### 1. Monolitos HTML y el "Smell" del Tamaño de Archivo (Línea 1000+)
*   **Problema:** Siete archivos HTML del proyecto exceden la marca de las 1,000 líneas de código, alcanzando picos de hasta 2,400 líneas. Esto se debe a que la estructura DOM, las clases de utilidad de Tailwind CSS, los bloques de estilos embebidos `<style>` y el código de inicialización de Alpine.js están concentrados en un solo archivo por demostración.
*   **Causa:** La arquitectura está diseñada para ejecutarse sin servidor local (con el protocolo `file://`), lo cual beneficia la portabilidad, pero introduce una alta complejidad de escaneo visual y dificultad de edición.

### 2. Duplicación de Lógica y Componentes Comunes
*   **Problema:** Elementos estructurales compartidos se copian textualmente en lugar de ser invocados o compilados:
    *   **Theme Switcher (Dracula Dark/Light):** La lógica de alternancia de temas y las variables CSS para el mapeo del tema Dracula se repiten en múltiples demos con variantes idénticas.
    *   **Mapas de Google:** Se repiten los iframes con configuraciones hardcodeadas, aunque algunos cumplen exitosamente con la **Regla D** del uso de exclamación `!` para delimitadores.
    *   **Reseteo de Formularios (Regla B):** La funcionalidad de limpieza se implementa manualmente campo por campo (`closeBooking()` en Café, `resetForm()` en Psicóloga) en lugar de utilizar un despachador o lógica reutilizable.

### 3. Acoplamiento DOM-Lógica en Alpine.js
*   **Problema:** Declaraciones complejas de objetos inline dentro de directivas HTML (por ejemplo, el `x-data` del menú responsive y planizadores de tiempos de visualización en el header de `index.html`) dificultan la legibilidad.
*   **Remedio:** Mover las definiciones de estado de Alpine.js a bloques `<script>` externos o scripts dedicados del frontend, lo que limpia el DOM y permite modularizar el comportamiento JavaScript.

---

## 🥋 Recomendaciones de Simplificación ("Code Judo")

Para optimizar y refinar el proyecto sin romper la compatibilidad offline (`file://`), se proponen las siguientes acciones estratégicas:

### Opción A: Desacoplamiento de Lógica JS (Bajo Impacto / Rápida Adopción)
Extraer las declaraciones de Alpine.js (`x-data`) de las etiquetas HTML y redefinirlas al final de los archivos o en un archivo común de utilidades `app.js` usando `Alpine.data()`.
```javascript
// app.js o bloque script
document.addEventListener('alpine:init', () => {
    Alpine.data('themeHandler', () => ({
        darkMode: localStorage.getItem('theme') !== 'light',
        toggleTheme() {
            this.darkMode = !this.darkMode;
            localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
        }
    }));
});
```

### Opción B: Build-step Opcional para Desarrollo
Implementar un generador de sitios estáticos minimalista (como Astro o un script simple en Node.js que realice renders de templates `.ejs` o `.html` parciales).
*   **Ventaja:** Permite separar los componentes comunes (`Navbar.html`, `ThemeToggle.html`, `HeadMeta.html`) en archivos modulares de menos de 150 líneas.
*   **Resultado:** El build compila hacia los archivos HTML monolíticos requeridos para el comportamiento offline, logrando modularidad en desarrollo y portabilidad en distribución.

---

##  Cumplimiento de Reglas Locales

*   **Regla A (file:// Link resolution):** Cumplido. Todos los enlaces apuntan explícitamente a archivos de destino `./demo-nombre/index.html`.
*   **Regla B (Modal Form Reset):** Cumplido en comportamiento. Las variables se limpian al 100% al cerrar las ventanas de contacto.
*   **Regla C (Opción Presencial por Defecto):** Cumplido. Los selectores de modalidad priorizan y pre-seleccionan la alternativa física.
*   **Regla D (Google Maps Exclamation format):** Cumplido. Se utiliza la notación de parámetros separados por `!` en lugar de barras verticales `|`.
