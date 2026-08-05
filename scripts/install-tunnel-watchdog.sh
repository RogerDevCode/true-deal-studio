#!/bin/bash
# install-tunnel-watchdog.sh
# Instala el watchdog del Cloudflare Tunnel como timer systemd.
# Requiere sudo. Ejecutar desde la raíz del repositorio true-deal-studio.
#
# Uso:
#   cd /home/manager/Sync/python_proyects/true-deal-studio
#   sudo bash scripts/install-tunnel-watchdog.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WATCHDOG_SCRIPT="$SCRIPT_DIR/tunnel-watchdog.sh"

echo "[1/5] Copiando script a /usr/local/bin/..."
sudo cp "$WATCHDOG_SCRIPT" /usr/local/bin/tunnel-watchdog.sh
sudo chmod +x /usr/local/bin/tunnel-watchdog.sh

echo "[2/5] Instalando tunnel-watchdog.service..."
sudo cp "$SCRIPT_DIR/tunnel-watchdog.service" /etc/systemd/system/

echo "[3/5] Instalando tunnel-watchdog.timer..."
sudo cp "$SCRIPT_DIR/tunnel-watchdog.timer" /etc/systemd/system/

echo "[4/5] Recargando systemd y habilitando timer..."
sudo systemctl daemon-reload
sudo systemctl enable --now tunnel-watchdog.timer

echo "[5/5] Estado del timer:"
sudo systemctl status tunnel-watchdog.timer --no-pager

echo ""
echo "Instalación completa."
echo "El watchdog verificará tuvitrina.lat cada 5 minutos y reiniciará el túnel si no responde."
echo ""
echo "Para ver logs:  journalctl -t tunnel-watchdog -f"
echo "Para desactivar: sudo systemctl disable --now tunnel-watchdog.timer"
