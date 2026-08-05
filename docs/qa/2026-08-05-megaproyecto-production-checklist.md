# Checklist de ejecución — preparación productiva del megaproyecto

Fecha de inicio: 5 de agosto de 2026.

## Regla de decisión

No declarar producción pública aprobada hasta cerrar todos los ítems críticos con
comando, fecha y evidencia reproducible. Un servicio saludable en Docker no
prueba por sí solo disponibilidad pública, recuperación, aislamiento o entrega.

## Línea base observada

- [x] Tu Vitrina local: gate de preproducción `PASS` en el commit `025e88d`.
- [x] VoiceLive local: API, web y PostgreSQL saludables; `/api/v1/ready` responde
  base de datos disponible.
- [x] VentaMax IA local: app, Caddy y PostgreSQL saludables; `/api/health` responde.
- [ ] Dominio público Tu Vitrina: `https://tuvitrina.lat/` responde `502`.
- [ ] Dominio público VoiceLive: `https://voice.tuvitrina.lat/widget/tuvitrina` responde `502`.
- [ ] VoiceLive: cobertura vigente documentada de 85,44 %, bajo el mínimo obligatorio de 90 %.
- [ ] Release reproducible: VoiceLive tiene cambios y migración sin commit; VentaMax tiene un script sin versionar.
- [ ] Publicación remota: los tres repositorios tienen commits locales no publicados.
- [ ] Infraestructura externa: sin evidencia de firewall restrictivo, secretos administrados,
  TLS operativo, alertas y backups cifrados fuera del host.
- [ ] Canary externo: Telegram, Google Calendar y recuperación del túnel no están verificados.

## Ejecución controlada

- [ ] Identificar los tres Compose y sus volúmenes persistentes.
- [ ] Ejecutar `down --remove-orphans` por stack, sin `--volumes`.
- [ ] Ejecutar `build --pull` y `up -d` por stack, uno a la vez.
- [ ] Confirmar migradores con salida `0`, servicios saludables y healthchecks locales.
- [ ] Confirmar que ninguna base PostgreSQL queda publicada al host en configuración productiva.

## Bloqueos a resolver, por prioridad

1. [ ] Restaurar `tuvitrina.lat` y `voice.tuvitrina.lat`; comprobar HTTPS, contenido esperado y recuperación.
2. [ ] Cerrar los cambios pendientes de VoiceLive: migración, pruebas, commit identificable y rollback.
3. [ ] Elevar cobertura real de VoiceLive a 90 % sin bajar el umbral ni excluir rutas críticas.
4. [ ] Verificar que el worker durable de Telegram permanece activo y drena outbox/reintentos en runtime.
5. [ ] Publicar commits aprobados y desplegar versiones identificables por hash.
6. [ ] Ejecutar verificadores RLS/roles y pruebas live de bypass en los artefactos finales.
7. [ ] Ejecutar backup, checksum y restore drill por cada base en el entorno de destino.
8. [ ] Configurar y probar monitoreo, alertas, rotación de logs, RPO/RTO y responsable de incidentes.
9. [ ] Hacer canaries aislados de Telegram, Google Calendar y VoiceLive; documentar éxito, fallo y recuperación.

## Criterio final

- [ ] APROBADO PARA STAGING: código versionado, gates locales completos, endpoints de staging y restauración verificados.
- [ ] APROBADO PARA PRODUCCIÓN: staging aprobado más DNS/TLS, firewall, secretos, backups externos,
  monitoreo, canaries y responsable operativo confirmados.
