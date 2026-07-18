# Diseño: README y `.gitignore` para GitHub

**Estado:** aprobado para revisión previa a implementación.

## Objetivo

Presentar el repositorio de forma clara en GitHub para personas interesadas en su propuesta comercial y para colaboradores técnicos. El README se escribe principalmente en español y conserva términos técnicos de uso universal.

## README

El documento sustituye la referencia obsoleta a `web-negocios-chile-pro.html` y describe el proyecto real.

Estructura propuesta:

1. Título y resumen: landing para PYMEs y emprendimientos chilenos, centrada en “Tu oferta clara antes del WhatsApp”.
2. Qué entrega: presentación de oferta, valores, horarios, atención, catálogo, reservas y escalamiento hacia e-commerce.
3. Catálogo de demos: resumen agrupado de las 14 demostraciones, con enlace al índice o rutas relevantes.
4. Tecnologías: HTML, CSS, Alpine.js, Node.js y Playwright.
5. Inicio local: abrir `index.html` mediante `file://` o usar el servidor estático.
6. Calidad: comandos de pruebas, `preproduction_gate.js`, compatibilidad offline, SEO, Open Graph, Twitter y JSON-LD.
7. Estructura del repositorio: carpetas y archivos actuales relevantes.
8. Documentación: referencias a `AGENTS.md`, especificación y plan de propuesta.

El texto usa español directo y conserva términos como `file://`, `SEO`, `Open Graph`, `JSON-LD`, `Node.js`, `Playwright`, `HTML`, `CSS` y `Alpine.js`.

## `.gitignore`

Se conservan las reglas existentes y se agregan reglas específicas para:

- archivos de entorno locales (`.env`, variantes locales y archivos de claves);
- cachés y logs de Node.js;
- coverage, reportes y artefactos de Playwright;
- archivos temporales, backups y herramientas de editor;
- almacenamiento local de pruebas y builds de herramientas.

Se mantienen versionados `package-lock.json`, recursos locales, pruebas, documentación y configuración del proyecto.

## Validación

- Confirmar que cada ruta y comando citado existe.
- Confirmar que `.gitignore` conserva `node_modules/`, reportes de Playwright y `voiceshop-pro.zip`.
- Ejecutar `git check-ignore` sobre artefactos representativos sin afectar archivos versionados.
- Revisar el diff para comprobar que la documentación representa la estructura actual.
