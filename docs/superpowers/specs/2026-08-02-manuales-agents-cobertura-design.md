# Diseño de manuales, contratos AGENTS y cobertura STAX

## Objetivo

Entregar documentación operativa que permita a una persona administrar STAX o
usar su tenant sin conocimientos técnicos avanzados; permitir que una LLM ubique
rápidamente la responsabilidad y los límites de cada repositorio; y definir un
camino auditable para llevar VoiceLive a una cobertura real mínima de 90% sin
debilitar pruebas.

## Fuente de verdad documental

True Deal Studio conserva los dos manuales transversales:

- `docs/manuales/MANUAL-ADMINISTRADOR-STAX.md`
- `docs/manuales/MANUAL-TENANT-STAX.md`

Los manuales explican el producto completo y enlazan la documentación técnica
específica. No se duplican en VoiceLive ni VentaMax IA. Cada `AGENTS.md` declara
la ruta absoluta y la responsabilidad de mantener sus secciones cuando cambie
una capacidad visible.

## Manual del administrador

El lector es quien instala, configura, supervisa o recupera el megaproyecto. El
manual seguirá el orden real de operación:

1. Mapa de STAX y límites entre Vitrina, Voz y Atención Ordenada.
2. Requisitos, URLs locales y verificaciones de salud.
3. Alta inicial, roles administrativos y creación de tenants.
4. Configuración de negocio, WhatsApp del negocio, Telegram, IA y Google Calendar.
5. Administración de horarios, servicios, FAQ, solicitudes y reservas.
6. Operación diaria, conciliación de Google Calendar y atención de derivaciones.
7. Secretos, privacidad, datos personales, RLS y separación de bases.
8. Backup, verificación, restauración y respuesta a incidentes.
9. Actualización, pruebas obligatorias y diagnóstico por síntoma.

Cada procedimiento tendrá precondición, pasos, resultado esperado y acción si
falla. No incluirá secretos reales ni asumirá que un contenedor `migrator` debe
permanecer activo después de terminar correctamente.

## Manual del tenant

El lector es el dueño o encargado de un negocio. Se usará lenguaje cotidiano,
con explicación breve del beneficio antes de cada configuración:

1. Qué hace cada servicio y qué decisiones conserva el negocio.
2. Primer ingreso y protección de la cuenta.
3. Datos del negocio, número de WhatsApp y horarios.
4. Servicios, disponibilidad, límite de reserva futura y Google Calendar.
5. Preguntas frecuentes: crear, revisar, importar, exportar y eliminar.
6. Solicitudes de hora, reserva manual, cancelación y reagendamiento.
7. Recordatorios por la preferencia del cliente: correo obligatorio y
   WhatsApp o Telegram cuando corresponda.
8. VentaMax IA: abrir Telegram, revisar conversaciones, pedidos, catálogo,
   pipeline y continuidad humana.
9. Privacidad, lenguaje inadecuado, datos que STAX no debe inventar y soporte.

El manual distinguirá claramente visitante, cliente final, tenant, operador y
administrador. No prometerá atención humana inmediata ni sincronización que no
esté confirmada.

## Contratos `AGENTS.md`

Cada archivo comenzará con una ficha de lectura rápida que responda, sin revisar
todo el repositorio:

- qué producto es y qué no es;
- cuál es su responsabilidad dentro de STAX;
- stack, puntos de entrada y mapa de carpetas;
- fuente de verdad de sus datos;
- puertos, URLs y health checks locales;
- comandos oficiales de arranque, prueba y recuperación;
- fronteras de seguridad, secretos y multi-tenancy;
- contratos con los otros dos repositorios;
- cambios que exigen pruebas transversales;
- prohibiciones y estado técnico conocido.

True Deal conservará sus reglas de `file://`, SEO y demos. VoiceLive incorporará
su arquitectura FastAPI/React, agenda interna como SSOT, Google Calendar como
espejo, roles PostgreSQL y gates Python/frontend. VentaMax IA sustituirá datos
obsoletos de `DATABASE_URL=postgres` y del contenedor de desarrollo por los roles
separados, RLS forzado, servicio migrador y comandos actuales.

## Plan de cobertura de VoiceLive

El plan se guardará en
`voicelive-v2/docs/superpowers/plans/2026-08-02-cobertura-real-90-red-team.md`.
La meta no será solo que `pytest-cov` muestre 90%; se exigirá evidencia de que
las pruebas detectan defectos.

### Línea base

- Ejecutar la suite sin modificar configuración y conservar el reporte por
  archivo, línea y rama.
- Confirmar qué rutas explican la diferencia entre la cifra histórica del README
  y el resultado actual.
- Clasificar huecos por riesgo: autenticación/tenant, reservas, Calendar,
  mensajería, RAG/FAQ, memoria, webhooks y manejo de errores.

### Reglas anti-trampa

- No reducir `--cov-fail-under=90`.
- No ampliar `omit`, `exclude_lines`, `pragma: no cover` ni exclusiones de CI
  para ocultar código ejecutable.
- No borrar, omitir, parametrizar superficialmente ni relajar assertions
  existentes para obtener verde.
- No sustituir igualdad exacta, efectos persistidos, errores o contratos por
  `is not None`, comprobaciones de status genéricas o snapshots sin semántica.
- No mockear la unidad que se pretende probar ni convertir una prueba de
  integración en una prueba de mocks.
- Una exclusión excepcional requiere evidencia de código no ejecutable y una
  aprobación red team independiente.

### Calidad exigida a cada prueba nueva o modificada

Cada caso declarará riesgo, precondición, estímulo, resultado observable y
estado posterior. Incluirá caminos negativos y límites cuando correspondan. La
revisión red team introducirá una mutación relevante —operador invertido,
validación eliminada, tenant cambiado, commit omitido o error absorbido— y
confirmará que al menos una prueba falla por la razón correcta.

### Gates de salida

- 100% de pruebas funcionales aprobadas.
- Cobertura global mínima de 90% y ningún módulo crítico por debajo de 90% en
  líneas o ramas.
- `ruff`, `mypy`, frontend, build y pruebas PostgreSQL aprobados.
- Cero pruebas debilitadas según diff semántico.
- Informe red team con mutaciones ejecutadas, fallos detectados y riesgos
  residuales; cualquier hallazgo alto bloquea el cierre.

## Validación documental

- Comprobar rutas, comandos y puertos contra archivos del repositorio y Compose.
- Buscar contradicciones entre manuales, README y `AGENTS.md`.
- Mantener líneas legibles y enlaces relativos para archivos versionados.
- Ejecutar `git diff --check` en cada repositorio.
- Los cambios documentales no modifican secretos, datos ni contenedores.
