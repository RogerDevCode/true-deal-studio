#!/bin/bash
# tunnel-watchdog.sh — Watchdog del Cloudflare Tunnel del megaproyecto STAX
# Verifica tuvitrina.lat y reinicia el contenedor del túnel si no responde.
#
# Instalación (requiere sudo):
#   sudo cp tunnel-watchdog.sh /usr/local/bin/tunnel-watchdog.sh
#   sudo chmod +x /usr/local/bin/tunnel-watchdog.sh
#   sudo cp tunnel-watchdog.service /etc/systemd/system/
#   sudo cp tunnel-watchdog.timer /etc/systemd/system/
#   sudo systemctl daemon-reload
#   sudo systemctl enable --now tunnel-watchdog.timer

DOMAIN="https://tuvitrina.lat/"
CONTAINER="voicelive_cloudflare_tunnel"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "$DOMAIN" 2>/dev/null)

if [ "$HTTP_CODE" != "200" ]; then
  logger -t tunnel-watchdog "ALERTA: $DOMAIN respondio '$HTTP_CODE' — reiniciando $CONTAINER"
  docker restart "$CONTAINER"
  sleep 5
  # Verificar recuperación
  HTTP_CODE2=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "$DOMAIN" 2>/dev/null)
  if [ "$HTTP_CODE2" = "200" ]; then
    logger -t tunnel-watchdog "OK: Tunel recuperado. $DOMAIN responde 200."
  else
    logger -t tunnel-watchdog "ERROR: Tunel no se recupero. $DOMAIN responde '$HTTP_CODE2' tras reinicio."
  fi
fi
