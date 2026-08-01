# Megaproyecto STAX

## Tratamiento de la oferta

Desde el 31 de julio de 2026, True Deal Studio, VoiceLive y chatbot se coordinan como una sola oferta comercial bajo la marca **STAX**:

> La web explica. La voz orienta. Tú decides el siguiente paso.

La integración se organiza así:

| Componente | Repositorio | Responsabilidad |
| --- | --- | --- |
| STAX Vitrina | `true-deal-studio` | Entrada comercial en `stax.ink`, evidencia y diagnóstico por WhatsApp. |
| STAX Voz | `voicelive-v2` | Orientación pública por texto y voz y derivación humana. |
| STAX Atención Ordenada | `venta-max-ia` | Recepción del contexto conversacional y continuidad humana por Telegram. |

## Regla de arquitectura

La oferta es única; los repositorios y despliegues siguen separados. La landing puede vivir en hosting estático y VoiceLive/chatbot pueden operar como servicios separados en un VPS. No se debe crear un contenedor monolítico ni compartir credenciales, volúmenes, bases de datos o secretos por conveniencia.

Todo cambio transversal define antes su contrato: origen, destino, URL o payload, autenticación, responsable, manejo de errores y prueba de extremo a extremo. La atención humana conserva el control de casos, decisiones y seguimiento.

## Coordinación

Los contratos operativos de los tres repositorios incluyen esta misma relación. Cuando una tarea afecte más de uno, revisar los tres `AGENTS.md`, preservar cambios locales ajenos, validar cada componente con su propia puerta de calidad y coordinar los commits y el despliegue sin asumir acceso a infraestructura externa.
