# Informe Devil's Advocate — frontend STAX, 3 de agosto de 2026

## Veredicto

NO APROBADO PARA PRODUCCIÓN EXTERNA — el runtime local, la seguridad PostgreSQL y los gates de STAX/VentaMax
quedaron verificados. VoiceLive aún no cumple su umbral exigido de cobertura real (85 %, mínimo 90 %); no se
reduce el umbral ni se excluye código para simular el cierre.

## Evidencia de reconstrucción local

El 3 de agosto de 2026 se ejecutó `down --remove-orphans` y una reconstrucción con `build --pull` de los tres
Compose del megaproyecto, sin `--volumes`; los datos PostgreSQL persistentes no se eliminaron.

| Componente | Evidencia | Resultado |
| --- | --- | --- |
| STAX Web | `compose.local.yaml`, `http://127.0.0.1:8081/health` | Contenedor healthy; responde healthcheck. |
| VoiceLive | `compose.yaml`, migrador exit 0, API/web/pgvector healthy, `http://127.0.0.1:8000/api/v1/ready` | Disponible; API declara base de datos disponible. |
| VoiceLive preview | `GET /api/v1/public/fonoaudiologia/preview` | 200, `Cache-Control: no-store`, sin WhatsApp ni token de sesión. |
| VentaMax IA | `docker-compose.yml`, migrador exit 0, app/Caddy/pgvector healthy, `http://127.0.0.1/api/health` | Disponible; health operativo y cola Telegram sin conflictos. |

## Gates reproducibles ejecutados

| Componente | Gate | Resultado |
| --- | --- | --- |
| STAX Web | `npm run qa:gate` | PASS: estáticos, media, pruebas Node y navegación `file://`; el gate ahora termina explícitamente al cerrar. |
| VoiceLive | Ruff format/lint, MyPy y `pytest --no-cov` | PASS: 151 pruebas aprobadas, 1 omitida; formato, lint y tipado sin hallazgos. |
| VentaMax IA | Vitest sobre PostgreSQL con URL administrativa de pruebas explícita | PASS: 67 archivos y 278 pruebas, incluyendo pedidos, concurrencia y colas. |
| VoiceLive y VentaMax IA | verificadores de roles/RLS y pruebas live de bypass | PASS: roles mínimos, RLS forzado, aislamiento A/B, auth, DDL, pool concurrente y pgvector. |
| VoiceLive y VentaMax IA | backup, verificación y restore drill | PASS: backup con checksum y restauración a base temporal; nunca sobre la base operativa. |

## Riesgos que bloquean el cierre de producción

| ID | Severidad | Hallazgo verificable | Corrección exigida |
| --- | --- | --- | --- |
| OPS-001 | Alto | El gate con cobertura de VoiceLive queda en 85 %, bajo el mínimo comprometido de 90 %. | Añadir pruebas de ramas de Calendar, RAG/transferencia, pedidos y memoria; mantener el mínimo de 90 %. |
| OPS-002 | Alto | Los gates se ejecutaron contra infraestructura local; falta el ensayo en un VPS con DNS/TLS, secretos de producción y backup fuera del host. | Crear entorno staging aislado y repetir gates, restore drill y pruebas de recuperación del túnel antes del corte público. |

## No verificado

- Caída y recuperación controlada del túnel Cloudflare de VoiceLive desde el hero, en un dominio público real.
- Canary autorizado de Telegram y autorización OAuth Google Calendar con credenciales de producción.

## Decisión razonada

La propuesta pública mejoró con evidencia verificable: STAX presenta un video local sintético de 18 segundos,
silencioso, subtitulado, con poster, fallback y CTA dominante; Fono y Belleza tienen un umbral de demo STAX;
VoiceLive carga identidad pública antes de consentimiento y el panel del tenant abre en “Hoy”; VentaMax abre en una
vista operativa de jornada. La base de datos ya se probó contra aislamiento, concurrencia, restauración y bypass.
El único bloqueo interno cuantificable es cobertura real de VoiceLive; luego corresponde el ensayo controlado de
staging/VPS. Por ello no se autoriza todavía un corte público.
