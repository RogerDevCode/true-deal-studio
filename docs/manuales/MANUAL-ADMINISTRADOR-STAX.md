# Manual del administrador STAX

## Propósito

Este manual explica cómo operar STAX como una sola oferta sin convertir sus tres aplicaciones en un monolito.
El administrador mantiene la vitrina pública, VoiceLive y VentaMax IA disponibles, aislados y recuperables.

STAX sigue esta secuencia comercial:

1. **STAX Web** explica la oferta y dirige al visitante.
2. **STAX Voz** orienta por texto o voz, administra solicitudes y conserva la agenda interna.
3. **VentaMax IA** atiende conversaciones y pedidos por Telegram con continuidad humana.

## Roles

- **Administrador STAX:** opera infraestructura, secretos, altas, respaldos, restauraciones y despliegues.
- **Superadministrador VoiceLive:** crea tenants y supervisa la plataforma de voz.
- **Propietario del tenant:** configura el negocio, Google Calendar, Telegram, equipo y conocimiento.
- **Operador del tenant:** atiende la operación permitida, sin administrar secretos ni configuración restringida.
- **Cliente final:** conversa, consulta, solicita una hora o realiza un pedido.

No existe una contraseña universal. En desarrollo, el administrador crea o asigna cada cuenta y entrega sus
credenciales por un canal privado. Nunca se escriben contraseñas, tokens o claves API en Git o en este manual.

## Arquitectura y fuentes de verdad

| Capacidad | Fuente de verdad | Regla |
| --- | --- | --- |
| Oferta y enlaces públicos | `true-deal-studio` | La landing explica; no guarda reservas ni pedidos. |
| Horarios, solicitudes y reservas | VoiceLive PostgreSQL | Google Calendar es una proyección de salida. |
| FAQ de voz | VoiceLive PostgreSQL + pgvector | Solo contenido publicado responde al público. |
| Conversaciones, catálogo y pedidos | VentaMax IA PostgreSQL | Telegram es el canal principal de esta aplicación. |
| Secretos | Entorno o administrador de secretos | Nunca Git, imágenes Docker ni documentación. |

Los repositorios, bases de datos, imágenes y credenciales permanecen separados. Una integración transversal
debe declarar origen, destino, autenticación, errores esperados, responsable y una prueba de extremo a extremo.

## Ubicaciones del megaproyecto

```text
/home/manager/Sync/python_proyects/true-deal-studio
/home/manager/Sync/python_proyects/voicelive-v2
/home/manager/Sync/python_proyects/venta-max-ia
```

## Arranque local

### 1. STAX Web

Desde `true-deal-studio`:

```bash
docker compose -f compose.local.yaml up -d --build
docker compose -f compose.local.yaml ps
curl --fail http://127.0.0.1:8081/health
```

La vitrina queda en `http://127.0.0.1:8081`.

### 2. VoiceLive

Desde `voicelive-v2`:

```bash
make env
make up
make ps
curl --fail http://127.0.0.1:8000/api/v1/ready
```

El panel queda en `http://127.0.0.1:5173`. El widget de un tenant usa
`http://127.0.0.1:5173/widget/<slug>`.

Si aún no existe un superadministrador:

```bash
make backend-create-superadmin EMAIL=administrador@dominio.cl
```

El comando crea la cuenta de forma interactiva. Entrega la contraseña por un canal privado y solicita su cambio
si se trata de una clave temporal.

### 3. VentaMax IA

Desde `venta-max-ia`:

```bash
./scripts/generate-local-secrets.sh
./scripts/bootstrap-postgres-roles.sh
docker compose up -d --build app
docker compose logs --no-color migrator
docker compose ps
curl --fail http://127.0.0.1/api/health
```

El migrador debe terminar con código `0` y la aplicación debe estar saludable. El acceso web local pasa por
Caddy. Las cuentas se crean mediante el registro autorizado o desde la gestión de equipo; no hay credenciales
predeterminadas publicables.

## Alta de un tenant

### VoiceLive

1. Inicia sesión como superadministrador.
2. Crea el tenant con nombre, slug único y datos básicos del negocio.
3. Asigna un propietario. Agrega operadores solo cuando exista una necesidad concreta.
4. Abre el espacio del tenant y verifica que los datos no sean visibles desde otra empresa.
5. Entrega al propietario la URL del panel y sus credenciales por un canal privado.
6. Acompaña la carga inicial siguiendo el orden del manual del tenant.

Los detalles de autorización están en
`/home/manager/Sync/python_proyects/voicelive-v2/docs/AUTH_AND_TENANCY.md`.

### VentaMax IA

1. Habilita el registro únicamente durante el alta o crea el acceso mediante el flujo administrativo disponible.
2. Confirma que el propietario quedó asociado a la organización correcta.
3. Pide al propietario cambiar cualquier contraseña temporal.
4. Deshabilita el registro público si no se necesita.
5. Prueba aislamiento con dos tenants antes de incorporar datos reales.

## Configuración de Google Calendar

VoiceLive conserva la agenda interna como fuente de verdad. Google Calendar recibe disponibilidad y reservas,
pero no decide qué horas están disponibles.

### Preparación central

1. Configura el proyecto OAuth de STAX y su pantalla de consentimiento.
2. Registra la URL HTTPS autorizada de retorno de VoiceLive.
3. Solicita el alcance `https://www.googleapis.com/auth/calendar.events.owned`.
4. Guarda `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` solo en el entorno del servidor.
5. Mientras Google mantenga la aplicación en pruebas, agrega como tester cada correo autorizado.
6. Para producción pública, completa la información de marca, privacidad, dominio y verificación exigida por Google.

### Activación para un tenant

1. El propietario abre **Calendario Externo** y pulsa **Conectar Google Calendar**.
2. Recomienda **Crear agenda exclusiva**. VoiceLive administrará únicamente esa agenda.
3. Si el propietario elige su calendario principal, debe aceptar una advertencia expresa.
4. En el calendario principal, VoiceLive solo modifica eventos creados y marcados por VoiceLive.
5. Ejecuta **Reconciliar agenda** y comprueba una creación, reagendamiento y cancelación de prueba.

La guía técnica completa está en
`/home/manager/Sync/python_proyects/voicelive-v2/docs/GOOGLE_CALENDAR_OPERATOR.md`.

## Configuración central de Telegram

VentaMax IA usa Telegram como canal principal por su facilidad de incorporación y menor costo operativo. Cada
tenant utiliza su propio bot.

1. Confirma que `APP_BASE_URL` sea HTTPS y apunte a VentaMax IA.
2. El propietario crea el bot con BotFather y copia el token una sola vez.
3. El propietario abre **Configuración > Telegram**, pega el token y conecta.
4. VentaMax IA registra una ruta opaca y un secreto de cabecera para el webhook.
5. Envía `/start` desde un chat de prueba y confirma recepción, respuesta e idempotencia.
6. No registres un mismo bot en dos tenants ni expongas el token en capturas, logs o tickets.

WhatsApp no forma parte del canal activo de VentaMax IA en esta etapa. Su interfaz aparece deshabilitada y no
debe prometerse como disponible hasta completar integración, costos de Meta y pruebas productivas.

## Operación diaria

Al comenzar la jornada:

1. Revisa que los contenedores estén saludables.
2. Comprueba los endpoints de readiness y health.
3. Revisa errores de sincronización de Google Calendar.
4. Revisa retrasos, conflictos y fallos de webhook de Telegram.
5. Confirma espacio disponible para PostgreSQL, respaldos y logs.

Al terminar cambios:

1. Ejecuta las puertas de calidad de cada repositorio afectado.
2. Revisa que ningún secreto aparezca en `git diff` o archivos nuevos.
3. Reconstruye solo los servicios modificados.
4. Ejecuta un recorrido real: landing, widget, solicitud/reserva y conversación Telegram.
5. Registra versión, resultado y cualquier riesgo pendiente.

## Respaldo y restauración

### VoiceLive

```bash
make backup
make verify-backup FILE=backups/archivo.dump
make backup-restore-drill
```

### VentaMax IA

```bash
./scripts/backup-postgres.sh
./scripts/verify-backup.sh backups/archivo.dump
./scripts/backup-restore-drill.sh
```

Un archivo no se considera respaldo hasta que pasa una restauración real en una base temporal. Conserva una
copia cifrada fuera del computador y define retención. Nunca agregues dumps a Git.

## Seguridad mínima obligatoria

- Mantén roles PostgreSQL separados para migración, aplicación, autenticación, ingreso, backup y restore.
- Conserva `ENABLE ROW LEVEL SECURITY` y `FORCE ROW LEVEL SECURITY` en tablas multi-tenant.
- Ejecuta pruebas de aislamiento y bypass después de cada cambio de esquema o permisos.
- Usa HTTPS en canales externos y callbacks OAuth.
- Rota inmediatamente cualquier secreto expuesto y revoca el anterior.
- Limita cuentas administrativas; una persona usa su propia cuenta.
- No uses datos reales en demos o capturas.
- Mantén respaldos cifrados y prueba su restauración de forma periódica.

## Puertas de liberación

### STAX Web

```bash
npm ci
npm run qa:gate
```

Resultado exigido: `PASS`, incluidos navegación `file://`, accesibilidad, formularios, consola y red.

### VoiceLive

```bash
make ci
make security-audit
make backup-restore-drill
```

Resultado exigido: formato, Ruff, mypy, backend, frontend y build verdes; cobertura real mínima de 90 % una vez
completado el plan vigente. Un número de cobertura no reemplaza pruebas de PostgreSQL, concurrencia o E2E.

### VentaMax IA

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm db:verify-security
pnpm db:test-security
./scripts/backup-restore-drill.sh
```

Resultado exigido: todo verde. Si una prueba externa requiere una credencial no disponible, se registra como
bloqueada; no se cambia a `skip` silencioso ni se sustituye por una prueba que no valida el riesgo.

## Diagnóstico rápido

| Síntoma | Comprobación | Acción |
| --- | --- | --- |
| La landing no abre VoiceLive | URL del widget y health de VoiceLive | Corrige origen/configuración y reconstruye STAX Web. |
| Error 1033 de Cloudflare | Estado de `cloudflared` y destino interno | Reinicia el túnel y valida que alcance el proxy. |
| Google muestra error 403 | Estado OAuth y correo tester | Autoriza el correo o completa publicación/verificación. |
| No aparecen eventos en Google | Conexión, agenda elegida y cola de sincronización | Reautoriza y ejecuta reconciliación. |
| Telegram no responde | Token, webhook, health y logs | Reconecta el bot y prueba `/start`; no imprimas el token. |
| Un tenant ve datos ajenos | RLS, rol runtime y contexto de tenant | Detén el servicio, preserva evidencia y trata como incidente. |
| El migrador falla | Logs y variables del rol migrador | No inicies la aplicación hasta corregir y repetir el gate. |
| Un respaldo no restaura | Checksum, manifiesto y drill | Descártalo como respaldo válido y genera uno nuevo. |

## Documentos relacionados

- `docs/STAX-MEGAPROYECTO.md`
- `docs/manuales/MANUAL-TENANT-STAX.md`
- `/home/manager/Sync/python_proyects/voicelive-v2/docs/PILOT_OPERATIONS.md`
- `/home/manager/Sync/python_proyects/voicelive-v2/docs/BACKUP_RESTORE.md`
- `/home/manager/Sync/python_proyects/venta-max-ia/docs/POSTGRES-SECURITY.md`
