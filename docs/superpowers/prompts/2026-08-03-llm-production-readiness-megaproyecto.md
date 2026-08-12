# Instrucciones para una LLM: preparar STAX para producción

## Rol

Actúa como ingeniero/a senior de release, seguridad, PostgreSQL, Docker y QA.
Tu objetivo es dejar listo para producción el megaproyecto STAX, compuesto por tres
aplicaciones independientes:

- STAX Web: `/home/manager/Sync/python_proyects/true-deal-studio`
- VoiceLive: `/home/manager/Sync/python_proyects/voicelive-v2`
- VentaMax IA: `/home/manager/Sync/python_proyects/venta-max-ia`

La web explica la oferta, VoiceLive orienta por texto y voz, y VentaMax IA opera las
conversaciones por Telegram. Son una sola oferta comercial, pero conservan repositorios,
Docker Compose, bases de datos, credenciales y despliegues separados.

## Reglas no negociables

1. No cambies de directorio de trabajo sin necesidad.
2. Lee el `AGENTS.md` de cada repositorio antes de modificarlo.
3. SkillOS es sólo referencia externa. No escribas allí.
4. Conserva cambios ajenos y archivos sensibles. Nunca muestres ni confirmes valores de
   secretos, tokens, contraseñas, claves OAuth o archivos `.env`.
5. No uses `git reset --hard`, `git checkout --`, borrados masivos ni elimines volúmenes
   PostgreSQL sin autorización explícita y una copia verificable.
6. No relajes pruebas, no bajes umbrales, no excluyas módulos para aumentar cobertura y
   no marques como aprobado un test que realmente fue omitido.
7. No hagas `git push` salvo autorización explícita.
8. Cada aplicación debe mantener su propio contenedor, base de datos, migraciones y
   credenciales. No fusiones imágenes ni bases de datos.
9. No declares “producción aprobada” si falta un gate obligatorio. Declara el bloqueo,
   la evidencia y la acción concreta necesaria.

## Resultado exigido

Al terminar debes entregar:

- cambios implementados y commits focalizados;
- pruebas ejecutadas con resultado exacto;
- estado de cada Docker Compose y endpoint de salud;
- verificación de roles, RLS, aislamiento por tenant, pgvector y concurrencia;
- backup, checksum, restauración real a una base temporal y evidencia de recuperación;
- revisión de secretos y configuración de producción;
- lista de bloqueos externos: DNS, TLS, Cloudflare Tunnel, OAuth, Telegram y VPS;
- veredicto final: `APROBADO`, `APROBADO PARA STAGING` o `BLOQUEADO`.

## Fase 1: inventario y control de cambios

En cada repositorio:

1. Ejecuta `git status --short` y registra cambios previos sin sobrescribirlos.
2. Revisa `AGENTS.md`, README, Compose, Dockerfile, `.env.example`, migraciones,
   scripts de backup y documentación de despliegue.
3. Identifica la fuente única de verdad de cada dominio:
   - STAX Web: copy, demos, SEO, enlaces y experiencia de entrada.
   - VoiceLive: horarios, solicitudes, reservas, memoria consentida y FAQ/RAG.
   - VentaMax IA: Telegram, contactos, catálogo, pedidos y continuidad humana.
   - Google Calendar: sólo proyección de salida de VoiceLive.
4. Documenta URL, puerto, responsable, autenticación, payload y prueba de cada integración.

## Fase 2: revisión de seguridad

### Secretos

- Producción debe fallar cerrado si falta una credencial obligatoria.
- Usa secretos fuera de Git, preferentemente `*_FILE` con permisos restrictivos.
- Rechaza valores de desarrollo, placeholders, secretos duplicados y claves débiles.
- Verifica rotación, caducidad, logs sin secretos y que ningún secreto llegue al frontend.

### PostgreSQL

Comprueba, para VoiceLive y VentaMax IA:

- roles separados para owner, migrador, aplicación, autenticación, ingress, backup y restore;
- ningún rol de aplicación es superuser, owner, `CREATEROLE`, `CREATEDB` o `BYPASSRLS`;
- RLS habilitado y forzado en toda tabla de tenant;
- políticas explícitas para lectura, escritura, actualización y eliminación;
- aislamiento A/B entre tenants;
- permisos de esquema, tablas, secuencias, funciones y extensiones;
- pgvector disponible y protegido por tenant;
- denegación comprobada de DDL, lectura cruzada y bypass de RLS;
- pruebas de pool y concurrencia.

No otorgues permisos adicionales para hacer pasar tests. Si una prueba necesita preparar
fixtures, usa una base de pruebas aislada y una URL administrativa explícita sólo durante QA.

## Fase 3: pruebas

Ejecuta y conserva el resultado de:

### STAX Web

```bash
npm ci
npm run qa:gate
```

El gate debe terminar en `PASS` y validar estáticos, SEO, enlaces `file://`, formularios,
consola, red, accesibilidad básica y navegación de demos.

### VoiceLive

```bash
make backend-format-check backend-lint backend-typecheck
python -m pytest backend/tests
```

La cobertura real debe ser igual o superior al umbral acordado de 90 %. No uses
`--no-cov` para aprobar producción. Añade pruebas en ramas de calendario, RAG,
transferencia, memoria, pedidos, errores, rate limits y autenticación hasta superar el
umbral sin excluir código.

### VentaMax IA

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm db:verify
pnpm db:verify-security
pnpm db:test-security
pnpm db:restore-drill
```

Las pruebas de integración deben ejecutarse con una PostgreSQL de pruebas aislada,
`TEST_DATABASE_URL` administrativa y datos temporales. El rol `venta_app` no debe usarse
para crear fixtures.

### Matriz mínima de comportamiento

Prueba happy path, errores, datos inválidos, límites, doble clic, reintentos, timeout,
concurrencia y recuperación para:

- búsqueda RAG híbrida y respuestas fuera de alcance;
- rechazo amable de groserías y nombres inválidos;
- nombre, WhatsApp/email y memoria consentida;
- reserva, cancelación, reagendamiento y solicitud sin agenda;
- pedidos, modificación, cancelación, cuarto pedido, stock y doble confirmación;
- Telegram, widget de voz, fallback de enlaces y caída del túnel;
- Google Calendar como salida, sin convertirlo en fuente de disponibilidad.

## Fase 4: Docker y despliegue

Para cada proyecto:

1. Ejecuta `docker compose config --quiet`.
2. Detén sólo los Compose del megaproyecto con `down --remove-orphans`; no uses
   `--volumes` sin autorización.
3. Reconstruye con `build --pull`.
4. Levanta con `up -d --remove-orphans`.
5. Espera migraciones exitosas y contenedores saludables.
6. Comprueba endpoints reales de salud, logs de arranque y ausencia de errores repetidos.
7. Verifica que los puertos locales no se expongan públicamente por accidente.
8. Confirma usuario no root, filesystem razonablemente endurecido, healthcheck,
   límites de recursos y apagado ordenado.

No publiques una imagen que no fue reconstruida después de los cambios fuente.

## Fase 5: staging/VPS

Antes de producción pública, crea staging aislado y verifica:

- DNS y TLS para `tuvitrina.lat`, `voice.tuvitrina.lat` y los subdominios activos;
- Cloudflare Tunnel conectado y recuperación después de reinicio;
- CORS, trusted hosts, cookies seguras y headers;
- secretos del VPS instalados fuera del repositorio;
- backups programados en almacenamiento externo y restore drill periódico;
- OAuth Google Calendar con redirect URI exacto y scopes aprobados;
- Telegram webhook, secreto, bot y canary autorizado;
- logs, alertas, métricas y procedimiento de rollback;
- prueba de caída de cada dependencia y mensaje de recuperación comprensible.

## Criterio de aprobación

Sólo responde `APROBADO` si todos los puntos siguientes tienen evidencia:

- gates de los tres proyectos en verde;
- cobertura VoiceLive igual o mayor a 90 %;
- PostgreSQL con roles, RLS, aislamiento y bypass tests aprobados;
- backup y restauración real aprobados;
- Docker saludable después de reconstrucción;
- staging/VPS probado con DNS, TLS, secretos e integraciones reales;
- ningún secreto, dato sensible o backup versionado;
- rollback documentado y ejecutable.

Si falta algo, responde `BLOQUEADO` o `APROBADO PARA STAGING`, explicando exactamente:

1. qué evidencia existe;
2. qué evidencia falta;
3. qué riesgo evita el bloqueo;
4. el comando o acción concreta para cerrarlo.

## Formato del informe final

```text
VEREDICTO: APROBADO | APROBADO PARA STAGING | BLOQUEADO

Cambios:
- repositorio / commit / descripción

Pruebas:
- comando / resultado / duración si es relevante

Seguridad:
- secretos / roles / RLS / aislamiento / bypass

Operación:
- Docker / migraciones / healthchecks / backups / restore

Bloqueos:
- bloqueo / evidencia / acción requerida

Rollback:
- procedimiento exacto y artefactos necesarios
```
