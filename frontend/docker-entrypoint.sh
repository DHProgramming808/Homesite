#!/bin/sh
set -eu

: "${API_BASE_URL:=http://localhost:5000}"

cat > /usr/share/nginx/html/config.js <<EOF
window.__CONFIG__ = {
  API_BASE_URL: "${API_BASE_URL}"
};
EOF

exec nginx -g "daemon off;"
