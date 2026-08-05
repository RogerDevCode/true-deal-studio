# Checklist de producción — Docker local con Cloudflare Tunnel

> **Última ejecución:** 2026-08-05 — ver sección Historial de ejecución.

**Fecha:** 5 de agosto de 2026
**Modalidad:** Docker local (sin VPS). Cloudflare Tunnel como única exposición pública.
**Criterio:** Un ítem está cerrado solo cuando tiene comando ejecutado, código HTTP confirmado o evidencia reproducible.

---

## Estado de servicios locales (línea base al inicio)

| Servicio | Puerto local | Status Docker | HTTP local |
|---|---|---|---|
| STAX Web (true-deal-studio) | `127.0.0.1:8081` | healthy | ✅ 200 |
| VoiceLive API | `127.0.0.1:8000` | healthy | ✅ 200 |
| VoiceLive Web | `127.0.0.1:5173` | healthy | ✅ 200 |
| VentaMax IA (Caddy) | `127.0.0.1:7080` | healthy | ✅ 307 |
| Cloudflare Tunnel | host network | running | ver sección dominios |

---

## Bloque A — Conectividad pública (Cloudflare Tunnel)

Todos los dominios pasan por un único túnel gestionado (`tunnelID: 731bad72`) con configuración de ingesta en Cloudflare.

### Rutas de ingesta activas

| Dominio | Destino local | Esperado |
|---|---|---|
| `tuvitrina.lat` | `http://127.0.0.1:8081` | 200 |
| `voice.tuvitrina.lat` | `http://127.0.0.1:5173` | 200 |
| `bot.tuvitrina.lat` | `http://127.0.0.1:7080` | 200/307 |

### Ítems

- [x] `tuvitrina.lat` responde `200` — verificado 2026-08-05 con `curl`.
- [x] `voice.tuvitrina.lat` responde `200` — verificado 2026-08-05 con `curl`.
- [x] `bot.tuvitrina.lat` responde `307` — verificado 2026-08-05 con `curl`.
- [x] El contenedor `voicelive_cloudflare_tunnel` registra 4 conexiones activas en logs.
- [ ] Tras reinicio del contenedor del túnel (`docker restart voicelive_cloudflare_tunnel`), los 3 dominios vuelven a responder en menos de 30 segundos. *(Probado manualmente; pendiente automatización.)*

**Problema identificado (2026-08-05):** El túnel pierde conexión silenciosamente cuando la red del host cambia (Wi-Fi reconecta, suspensión, etc.). El servicio sigue marcado como `running` pero los dominios dan timeout. El reinicio manual del contenedor resuelve el síntoma. Se requiere watchdog automático.

**Acción manual requerida (BLOQUEANTE para operación desatendida):**
El usuario debe configurar un mecanismo de vigilancia del túnel. Ver Bloque E.

---

## Bloque B — Código versionado y publicado

| Repo | Commits locales sin publicar | Archivos sin commit |
|---|---|---|
| `true-deal-studio` | 8 commits sobre `origin/main` | 1 archivo `docs/qa/` |
| `voicelive-v2` | 3 commits sobre `origin/main` | 18 archivos modificados + migración + seed |
| `venta-max-ia` | 2 commits sobre `origin/main` | 2 archivos modificados |

- [ ] **VoiceLive:** commitear los 18 archivos modificados + migración `20260803_0024_visitor_memory_email.py` + seed `seed_stax_rag.py` con mensaje descriptivo.
- [ ] **VentaMax IA:** commitear `docker-compose.yml` modificado + `scripts/seed_admin.ts` con mensaje descriptivo.
- [ ] **true-deal-studio:** incluir `docs/qa/` en un commit de cierre.
- [ ] Publicar los 3 repos a sus remotos (`git push origin main`) — requiere autorización del usuario.

---

## Bloque C — Cobertura de pruebas VoiceLive

**Estado:** 85,44 % actual — mínimo exigido: 90 %.

Las rutas sin cobertura son los flujos de mayor riesgo operativo: Calendar, RAG/transferencia, pedidos y memoria de visita.

- [ ] Ejecutar `pytest --cov` en VoiceLive y obtener el reporte actual con los archivos modificados.
- [ ] Identificar exactamente qué módulos están por debajo del 90 %.
- [ ] Añadir pruebas a los módulos deficientes sin bajar umbrales ni usar mocks amplios.
- [ ] Confirmar `pytest --cov` termina con cobertura ≥ 90 % antes de declarar producción aprobada.

---

## Bloque D — Gates de calidad locales

- [x] `npm run qa:gate` en true-deal-studio → **PASS** (2026-08-05, código actual).
- [x] VoiceLive: **152 pruebas aprobadas** vía `.venv/bin/python -m pytest --no-cov` (2026-08-05, código con archivos modificados sin commit).
- [x] **VentaMax IA:** **278 de 278 pruebas aprobadas (67 de 67 archivos PASS)** ejecutadas contra la BD local mediante `tests/vitest.setup.ts` inyectando `TEST_DATABASE_URL` para fixtures administrativas (2026-08-05).
- [x] RLS, roles mínimos, bypass tests y restore drill — **PASS** (2026-08-03).

### Cómo ejecutar los gates de VentaMax correctamente

```bash
# Opción A: levantar el stack de desarrollo (expone 127.0.0.1:5432)
cd /home/manager/Sync/python_proyects/venta-max-ia
docker compose -f docker-compose.dev.yml up -d postgres
pnpm test
docker compose -f docker-compose.dev.yml down

# Opción B: ejecutar los tests dentro de la red Docker (requiere contenedor con Node)
# (pendiente de implementar)
```

---

## Bloque E — Estabilidad del túnel en producción local

Este es el **riesgo operativo principal** del modelo Docker-local. Si el túnel cae, el sistema queda inaccesible sin intervención manual.

### Problema raíz

El contenedor `voicelive_cloudflare_tunnel` tiene `restart: unless-stopped`, lo que lo reinicia si el proceso muere. Sin embargo, si la red del host se interrumpe y vuelve (Wi-Fi, suspensión), el proceso sigue corriendo pero las conexiones hacia Cloudflare Edge quedan en estado zombie. El contenedor no detecta esto como un fallo y no se reinicia solo.

### Opción recomendada — Watchdog como servicio systemd en el host

```bash
# Crear /usr/local/bin/tunnel-watchdog.sh
#!/bin/bash
DOMAIN="https://tuvitrina.lat/"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$DOMAIN")
if [ "$HTTP_CODE" != "200" ]; then
  logger -t tunnel-watchdog "Dominio $DOMAIN respondió $HTTP_CODE — reiniciando túnel"
  docker restart voicelive_cloudflare_tunnel
fi
```

```ini
# /etc/systemd/system/tunnel-watchdog.timer
[Unit]
Description=Tunnel watchdog timer

[Timer]
OnBootSec=2min
OnUnitActiveSec=5min

[Install]
WantedBy=timers.target
```

- [ ] **[MANUAL] El usuario crea, instala y habilita el watchdog systemd** (requiere sudo).
- [ ] Probar watchdog simulando caída: `docker stop voicelive_cloudflare_tunnel` → esperar hasta 5 min → verificar que el watchdog lo reinicia automáticamente.
- [ ] Verificar `journalctl -u tunnel-watchdog` muestra log del evento.

---

## Bloque F — Canaries de integraciones externas

- [ ] **Telegram:** enviar mensaje al bot en `bot.tuvitrina.lat` y verificar respuesta; revisar logs de VentaMax por errores de webhook.
- [ ] **Google Calendar:** verificar que VoiceLive puede leer/escribir eventos con las credenciales OAuth activas.
- [ ] **Widget desde dominio público:** abrir `https://tuvitrina.lat/` en navegador y verificar que el widget de VoiceLive carga sin errores de consola o CORS.

---

## Bloque G — Backup y recuperación

Los drills de backup pasaron localmente el 3 de agosto. En producción Docker-local:

- [ ] Verificar que los backups de PostgreSQL (VoiceLive y VentaMax) se escriben en un directorio del host, fuera de los volúmenes Docker.
- [ ] Verificar que ese directorio NO se eliminaría con `docker compose down --volumes`.
- [ ] **[MANUAL] El usuario define periodicidad** (recomendado: diario) y destino de los backups (disco externo, carpeta Sync, nube).

---

## Participación manual requerida

| # | Acción | Prioridad | Bloque |
|---|---|---|---|
| M-1 | Instalar y activar el watchdog systemd del túnel | 🔴 Alta | E |
| M-2 | Autorizar `git push` de los 3 repos | 🟡 Media | B |
| M-3 | Verificar Telegram y Calendar manualmente | 🟡 Media | F |
| M-4 | Definir destino y periodicidad de backups | 🟡 Media | G |

---

## Criterio de aprobación

| Nivel | Condición mínima |
|---|---|
| **Operativo** | Bloque A completo + Bloque D gates en PASS + Watchdog activo (E) |
| **Producción formal** | Todo lo anterior + Bloques B, C, F y G completados |

---

## Historial de ejecución

| Fecha | Acción | Resultado |
|---|---|---|
| 2026-08-03 | Reconstrucción completa de los 3 stacks | PASS |
| 2026-08-03 | Gates RLS, bypass, backup/restore | PASS |
| 2026-08-03 | Red team frontend STAX | NO APROBADO (cobertura VoiceLive 85 %) |
| 2026-08-04 | Rebrand a Tu Vitrina, `qa:gate` STAX | PASS |
| 2026-08-05 | Diagnóstico: `tuvitrina.lat` y `voice.tuvitrina.lat` daban timeout | BLOQUEADO |
| 2026-08-05 | `docker restart voicelive_cloudflare_tunnel` → 3 dominios responden | ✅ 200/200/307 |
| 2026-08-05 | `npm run qa:gate` STAX Web — código actual | ✅ PASS |
| 2026-08-05 | VoiceLive pytest `.venv` — 152 pruebas | ✅ PASS |
| 2026-08-05 | VentaMax `pnpm test` con `vitest.setup.ts` — 278/278 pruebas | ✅ PASS (67/67 archivos) |
| 2026-08-05 | Scripts de watchdog creados en `scripts/` | ✅ Listo para instalar |
