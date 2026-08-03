# Informe Devil's Advocate — frontend STAX, 3 de agosto de 2026

## Veredicto

NO APROBADO PARA PRODUCCIÓN — implementación de conversión terminada, pero faltan gates de backend/integración
reproducibles para VoiceLive y VentaMax IA. No existe evidencia suficiente para elevar el resultado a producción.

## Riesgos que bloquean el cierre de esta mejora

| ID | Severidad | Hallazgo verificable | Corrección exigida |
| --- | --- | --- | --- |
| OPS-001 | Alto | `make ci` de VoiceLive se detiene en `ruff format --check` de siete archivos backend preexistentes. | Formatear los siete archivos reportados, ejecutar `make ci` desde un entorno con dependencias y corregir cualquier falla posterior. |
| OPS-002 | Alto | La suite completa de VentaMax falla sin las tres URL de BD exigidas y omite pruebas de integración/concurrencia. | Levantar la base de pruebas documentada, inyectar sólo credenciales locales efímeras y ejecutar `pnpm test`, `pnpm db:test-security` y el drill de restore. |
| OPS-003 | Medio | La ejecución completa de Playwright STAX se inició (75 pruebas) pero la herramienta de runner no devolvió un cierre reproducible de toda la suite. | Ejecutar `npm run qa:e2e` de forma aislada y conservar su resultado completo antes del despliegue. |

## No verificado

- Caída controlada del túnel de VoiceLive desde el hero.
- `GET /public/<slug>/preview` en un entorno real con PostgreSQL y RLS activos: el test fue escrito y el código pasó
  compilación/ruff, pero Pytest local quedó bloqueado por la dependencia `argon2` ausente.
- Integración completa de la vista diaria de VentaMax contra PostgreSQL y Telegram; sus contadores usan rutas
  autenticadas existentes, pero no se probó con la BD de integración.

## Decisión razonada

La propuesta pública mejoró con evidencia verificable: STAX presenta un video local sintético de 18 segundos,
silencioso, subtitulado, con poster, fallback y CTA dominante; Fono y Belleza tienen un umbral de demo STAX;
VoiceLive carga identidad pública antes de consentimiento y el panel del tenant abre en “Hoy”; VentaMax abre en una
vista operativa de jornada. Las pruebas focalizadas aprobadas son STAX 6/6, VoiceLive frontend 21 archivos/50 tests,
y VentaMax typecheck/lint + 2/2 de la nueva lógica + build. Nada de ello sustituye las pruebas de base de datos,
aislamiento, concurrencia ni despliegue: por eso el veredicto se mantiene rechazado para producción.
