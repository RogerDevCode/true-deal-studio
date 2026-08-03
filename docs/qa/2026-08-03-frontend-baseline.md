# Línea base frontend STAX — 3 de agosto de 2026

## Alcance revisado

| Superficie | Primera acción actual | Dependencia externa | Responsable de datos |
| --- | --- | --- | --- |
| STAX `/index.html` | Pedir orientación o abrir ejemplos | VoiceLive al abrir la prueba de voz | STAX: copy, demos y enlaces |
| Demos STAX | Solicitar, consultar o reservar según rubro | WhatsApp o VoiceLive cuando corresponde | Cada demo es referencial; no guarda datos operativos |
| VoiceLive `/widget/<tenant>` | Crear sesión pública con consentimiento | API VoiceLive, LLM, agenda y Google Calendar | VoiceLive |
| VoiceLive panel tenant | Abrir Configuración | API, PostgreSQL y Google Calendar | VoiceLive |
| VentaMax `/inbox` | Revisar conversaciones | API, PostgreSQL y Telegram | VentaMax IA |
| VentaMax `/orders` | Revisar pedidos | API, PostgreSQL y Telegram | VentaMax IA |

## Evidencia inicial reproducible

| Repositorio | Comando | Resultado observado | Estado |
| --- | --- | --- | --- |
| True Deal Studio | `npm run qa:gate` | Ejecutado antes de esta ola; se repetirá al cierre con el módulo de voz. | Pendiente de cierre |
| VoiceLive | `make ci` | Falló en `ruff format --check`: 7 archivos requieren formato. | Riesgo abierto |
| VentaMax IA | `pnpm typecheck && pnpm lint && pnpm test && pnpm build` | Typecheck y lint iniciaron; tests fallaron por variables de entorno de BD ausentes. Varias pruebas de integración quedaron omitidas por no disponer del entorno. | Riesgo abierto |

No se cambió ninguna prueba, configuración de secretos ni requisito de cobertura para obtener este resultado.

## Dependencias y recuperación esperada

| Dependencia | Fallo visible aceptable | Recuperación que debe existir |
| --- | --- | --- |
| Túnel VoiceLive | No se puede abrir la conversación | Explicar la indisponibilidad y ofrecer orientación/contacto alternativo |
| Video local | El navegador no reproduce video | Poster y transcripción estática conservan el mensaje |
| Telegram | No llega la continuidad | El operador ve estado y puede revisar/reintentar según la operación |
| Google Calendar | No sincroniza | VoiceLive conserva agenda como fuente de verdad y presenta el incidente al tenant |

