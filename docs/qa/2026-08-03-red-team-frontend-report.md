# Informe Devil's Advocate — frontend STAX, 3 de agosto de 2026

## Veredicto

NO APROBADO — línea base previa a la implementación.

## Riesgos que bloquean el cierre de esta mejora

| ID | Severidad | Hallazgo verificable | Corrección exigida |
| --- | --- | --- | --- |
| UX-001 | Medio | La voz existe en el hero, pero no es aún la acción principal ni demuestra su resultado antes del clic. | Implementar módulo de prueba, CTA dominante y prueba de comprensión. |
| UX-002 | Medio | La barra de demo de Fonoaudiología usa una estética cercana a la landing y no expresa de forma inequívoca la frontera STAX → demo. | Añadir umbral persistente STAX y mantener identidad propia de la profesional. |
| OPS-001 | Medio | El gate de VoiceLive no alcanza el chequeo de formato. | Formatear sólo los archivos reportados y volver a ejecutar el gate. |
| OPS-002 | Alto | Los tests de VentaMax no disponen de variables de BD y omiten integración; por tanto no prueban el entorno completo. | Ejecutar la suite con el entorno de pruebas documentado, sin secretos reales. |

## No verificado

- Caída controlada del túnel de VoiceLive desde el hero.
- Carga y recuperación del widget con identidad pública real.
- Vista diaria de VoiceLive y VentaMax, aún inexistentes en esta línea base.
- Presupuesto de peso de los medios propuestos, hasta generar los artefactos.

## Decisión razonada

La propuesta no se aprueba todavía. El resultado final debe demostrar que la página conserva orientación cuando el
video o el túnel no están disponibles, y que los paneles internos llevan al operador a una acción real antes que a
configuración técnica.

