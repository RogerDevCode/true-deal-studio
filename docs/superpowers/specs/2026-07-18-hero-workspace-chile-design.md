# Diseño: hero de espacio de trabajo y cobertura nacional

**Estado:** aprobado para revisión antes de implementación.

## Objetivo

Reemplazar la imagen hero asociada a Santiago por un recurso visual neutro y profesional. Actualizar la landing principal para comunicar atención en todo Chile.

## Hero

- Generar una fotografía editorial horizontal de un espacio de trabajo de pequeña empresa.
- Escena: escritorio ordenado, cuaderno, teléfono y materiales de negocio; luz natural y atmósfera profesional.
- Composición: sujeto visual a la derecha y espacio visual a la izquierda para el titular.
- Exclusiones: personas identificables, logos, texto, letreros, skyline, hitos urbanos y referencias geográficas.
- Nuevo archivo: `assets/optimized/hero-workspace.webp`.
- Conservar `assets/optimized/santiago-hero.webp` como asset histórico sin referencia activa.

## Cobertura

En `index.html`, reemplazar referencias territoriales de la landing por:

> **Atención en todo Chile**

Las ciudades presentes dentro de demos se mantienen: representan negocios ficticios y sus flujos de atención.

## Integración

- Actualizar preload y regla CSS del hero hacia el asset nuevo.
- Mantener contraste, legibilidad, carga diferida y compatibilidad `file://`.
- Añadir `.superpowers/` a `.gitignore` para excluir archivos del companion visual.

## Validación

- Confirmar que `index.html` carece de referencias a Santiago o Concepción.
- Validar recurso local, navegación `file://`, consola y gate de preproducción.
- Revisar visualmente hero en viewport desktop y móvil.

