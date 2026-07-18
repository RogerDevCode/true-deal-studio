# Diseño: manual operativo compacto para `AGENTS.md`

**Estado:** aprobado para revisión antes de implementación.

## Objetivo

Reemplazar la guía extensa y parcialmente desactualizada por un manual operativo que permita a un LLM entender el proyecto y trabajar con seguridad en una sola lectura.

## Estructura

1. Contexto: nombre True Deal Studio, público chileno y propuesta “Tu oferta clara antes del WhatsApp”.
2. Stack: HTML, CSS/Tailwind compilado, Alpine.js, Node.js 22, Playwright y Chrome Headless.
3. Mapa de repositorio: landing, assets, demos, pruebas, scripts, documentos, `README.md` y `package.json`.
4. Reglas obligatorias: enlaces `file://`, formularios, atención presencial, mapas, CSS, SEO, accesibilidad y copy afirmativo.
5. Prohibiciones: testimonios/resultados inventados, enlaces a `voiceshop-pro.zip`, dependencias externas que rompan uso offline, cambios destructivos y cambios fuera de alcance.
6. Flujo de trabajo: instalación, comandos de QA, criterio de preproducción y uso de documentación.
7. Git: revisar estado antes de editar, preservar trabajo ajeno, commits focalizados y publicación solo con autorización.

## Reglas de contenido

- Usar español directo y conservar términos técnicos universales: `file://`, HTML, CSS, Tailwind, Alpine.js, Node.js, Playwright, Chrome Headless, SEO, Open Graph, Twitter Cards y JSON-LD.
- Priorizar órdenes verificables y rutas concretas sobre explicaciones extensas.
- Incluir el estado comercial actual: demos como evidencia de criterio, sin atribuir resultados a clientes.
- Registrar que la marca pública vigente en la landing es STAX; True Deal Studio identifica el repositorio y la evolución de la propuesta hasta que exista un rebranding coordinado.

## Validación

- Comprobar que comandos, rutas y nombres de demos existen.
- Revisar que las prohibiciones preservan las restricciones anteriores.
- Ejecutar `npm run qa:gate` después de cambios de producto antes de aprobar despliegue.
