# Defensa PostgreSQL en profundidad para STAX

## Objetivo

Cerrar los bloqueos PostgreSQL detectados por la auditoría adversarial en
VoiceLive y Venta Max IA: separar responsabilidades de base de datos, imponer
aislamiento multi-tenant con RLS forzado, eliminar secretos inseguros y probar
la recuperación con restauraciones reales. True Deal Studio no almacena datos
de aplicación y solo conserva este contrato transversal.

## Fronteras del megaproyecto

| Componente | Base | Clave tenant | Responsabilidad |
| --- | --- | --- | --- |
| True Deal Studio | Ninguna | No aplica | Entrada pública estática. |
| VoiceLive | PostgreSQL + pgvector | `tenant_id` | Voz, conversaciones, reservas, conocimiento e integraciones. |
| Venta Max IA | PostgreSQL + pgvector | `organization_id` | Atención, Telegram, CRM, pedidos, catálogo y RAG. |

Las bases, roles, credenciales, backups y migraciones permanecen separados. Un
fallo o una restauración en un componente no debe afectar al otro.

## Decisión de arquitectura

Ambas aplicaciones usarán contexto tenant local a la transacción y políticas
`FORCE ROW LEVEL SECURITY`. Los filtros ORM actuales continúan como primera
defensa; RLS protege frente a consultas que omitan accidentalmente el filtro.

Cada base crea roles equivalentes con prefijo propio:

- `owner`: `NOLOGIN`, propietario de objetos.
- `migrator`: ejecuta migraciones versionadas mediante `SET ROLE owner`.
- `app`: tráfico autenticado y trabajos tenant, sin DDL ni `BYPASSRLS`.
- `auth`: identidad y sesiones antes de resolver tenant; sin acceso a tablas de
  negocio.
- `ingress`: entrada pública o webhook mediante funciones mínimas.
- `backup`: lectura global de solo lectura para `pg_dump`; no se entrega a la
  aplicación.
- `restore`: restaura exclusivamente bases temporales durante un simulacro.
- `postgres`: bootstrap y emergencia; nunca runtime normal.

La resolución inicial de login, slug, integración o webhook se implementa con
funciones pequeñas `SECURITY DEFINER`, parámetros tipados, `search_path` fijo,
sin SQL dinámico y sin permisos para `PUBLIC`. Una vez resuelto el tenant, cada
operación abre una transacción y fija tenant, usuario y actor con
`set_config(..., true)`. El contexto desaparece al terminar la transacción y no
puede filtrarse al siguiente usuario del pool.

## Cobertura RLS

Toda tabla de aplicación debe quedar clasificada automáticamente:

1. Tabla tenant: política simétrica `USING`/`WITH CHECK` por tenant.
2. Identidad o raíz global: política específica de usuario, membresía o tenant.
3. Tabla técnica: privilegios restringidos y justificación explícita.

Solo el historial interno de migraciones y objetos administrativos estrictos
pueden quedar fuera de RLS. Una tabla nueva no clasificada hace fallar CI. Las
relaciones entre recursos tenant incorporan FK compuesta `(tenant_id, id)` o
`(organization_id, id)` cuando sea necesaria para impedir referencias
cruzadas.

## Secretos

- Producción no contiene valores por defecto para contraseñas, URLs con
  credenciales, autenticación, cifrado, webhooks ni proveedores externos.
- Compose y la validación de runtime fallan antes de aceptar tráfico si falta
  un secreto crítico.
- Se aceptan secretos montados como archivos mediante `*_FILE`.
- Desarrollo usa credenciales aleatorias locales, ignoradas por Git y con
  permiso `0600`; no usa `postgres/postgres`.
- La imagen no contiene secretos y cada proceso recibe solo la credencial que
  necesita.

## Migración y recuperación

Antes de activar RLS se crea y restaura un backup real. Un preflight rechaza
tenant nulo, referencias huérfanas o cruzadas y objetos sin clasificación; no
repara ni elimina datos automáticamente. Después se crean roles, funciones,
constraints, políticas y grants mediante migraciones versionadas.

Cada simulacro usa dump PostgreSQL custom, permisos `0600`, checksum SHA-256 y
una base temporal con nombre validado. Tras `pg_restore`, comprueba versión de
migración, extensiones, objetos, conteos, constraints, índices y aislamiento
RLS. Registra duración y resultado sin incluir secretos ni contenido de
clientes. Solo la base temporal se elimina al finalizar.

## Pruebas obligatorias

- Bootstrap desde base vacía y actualización desde copia del estado actual.
- Atributos, ownership y grants de cada rol.
- Denegación sin contexto y CRUD cruzado entre dos tenants.
- Referencias cruzadas, joins, UPSERT, pools reutilizados y concurrencia.
- Login, signup, entrada pública, voz, webhooks, jobs y administración.
- Aislamiento de FAQ, productos y embeddings en búsqueda híbrida/pgvector.
- Arranque fallido con secretos ausentes, débiles o reutilizados.
- Restauración real y repetición de pruebas RLS sobre la copia restaurada.
- Suites completas, builds Docker y health/readiness saludables.

## Criterio de salida

La iniciativa termina solo cuando ambas aplicaciones usan roles runtime sin
privilegios administrativos, todas las tablas están protegidas o justificadas,
las pruebas pasan, los secretos fallan cerrados, existe un restore drill real
por base y los contenedores reconstruidos quedan saludables. La validación
local no sustituye la aceptación posterior de TLS, firewall, backups externos y
credenciales del VPS.
