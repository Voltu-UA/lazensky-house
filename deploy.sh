#!/usr/bin/env bash
#
# deploy.sh — провізіонінг сервера під сайт lazensky-house
# Стек: Ubuntu 22.04/24.04  →  Node.js (LTS) + pm2 + nginx + Let's Encrypt (HTTPS)
#
# Використання (на чистому сервері, від root):
#   git clone https://github.com/Voltu-UA/lazensky-house.git
#   cd lazensky-house
#   DOMAIN=lazensky.if.ua EMAIL=you@example.com bash deploy.sh
#
# DOMAIN / EMAIL / NODE_MAJOR можна перевизначити змінними оточення,
# або лишити дефолтні значення нижче.
#
set -euo pipefail

DOMAIN="${DOMAIN:-lazensky.if.ua}"
EMAIL="${EMAIL:-admin@${DOMAIN}}"
NODE_MAJOR="${NODE_MAJOR:-24}"
APPDIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Сайт:   $APPDIR"
echo "==> Домен:  $DOMAIN"
echo "==> Email:  $EMAIL  (реєстрація Let's Encrypt)"

echo "==> Базові пакети"
apt update && apt -y upgrade
apt install -y curl ca-certificates git nginx

echo "==> Node.js ${NODE_MAJOR} LTS + pm2"
curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
apt install -y nodejs
npm i -g pm2

echo "==> Залежності сайту"
cd "$APPDIR"
npm ci --omit=dev

echo "==> Запуск через pm2 + автозапуск після ребуту"
pm2 start server.js --name server || pm2 restart server
pm2 save
pm2 startup systemd -u root --hp /root
pm2 save

echo "==> nginx (HTTP, реверс-проксі на :3000)"
cat > /etc/nginx/sites-available/lazensky <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
ln -sf /etc/nginx/sites-available/lazensky /etc/nginx/sites-enabled/lazensky
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "==> HTTPS (Let's Encrypt; авто-продовження вмикається автоматично)"
apt install -y certbot python3-certbot-nginx
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect

echo ""
echo "==> ГОТОВО → https://$DOMAIN"
pm2 list
lsb_release -d
