#!/bin/sh
# Velkor API — Production startup script
# Fails fast with clear error messages if required env vars are missing.
set -e

echo "════════════════════════════════════════════════"
echo "  Velkor API — Starting"
echo "  NODE_ENV : ${NODE_ENV:-<unset>}"
echo "  PORT     : ${PORT:-1337}"
echo "════════════════════════════════════════════════"

# ── Pre-flight: required env vars ────────────────────────────────────────────
# Check here at shell level BEFORE Node.js starts — fail fast with a clear
# error that surfaces immediately in Railway logs.

MISSING_VARS=""

check_required() {
  VAR_NAME="$1"
  # Indirect variable expansion (POSIX-compatible)
  eval "VAR_VALUE=\$$VAR_NAME"
  if [ -z "$VAR_VALUE" ]; then
    MISSING_VARS="${MISSING_VARS}  ✗ ${VAR_NAME}\n"
  else
    echo "  ✓ ${VAR_NAME}"
  fi
}

echo ""
echo "Checking required env vars..."
check_required ADMIN_JWT_SECRET
check_required JWT_SECRET
check_required API_TOKEN_SALT
check_required TRANSFER_TOKEN_SALT
check_required APP_KEYS
check_required DATABASE_HOST
check_required DATABASE_NAME
check_required DATABASE_USERNAME
check_required DATABASE_PASSWORD

if [ -n "$MISSING_VARS" ]; then
  echo ""
  echo "╔══════════════════════════════════════════════╗"
  echo "║  STARTUP BLOCKED — Missing env vars          ║"
  echo "╚══════════════════════════════════════════════╝"
  printf "%b" "$MISSING_VARS"
  echo ""
  echo "  → Generate secrets : node scripts/generate-secrets.js"
  echo "  → Set in Railway   : Dashboard → Service → Variables"
  echo "  → Reference        : .env.example"
  echo ""
  exit 1
fi

echo ""
echo "All required env vars present."
echo ""

# ── Validate database config ──────────────────────────────────────────────────
echo "Validating database config..."
node -e "
  try {
    const cfg = require('./config/database.js')
    const conn = cfg && cfg.connection && cfg.connection.connection
    if (!cfg || !cfg.connection || !cfg.connection.client) {
      console.error('database.js: missing connection.client')
      process.exit(1)
    }
    console.log('  ✓ database.js OK — client:', cfg.connection.client, '| host:', conn && conn.host)
  } catch(e) {
    console.error('  ✗ database.js error:', e.message)
    process.exit(1)
  }
"

# ── Required directories ──────────────────────────────────────────────────────
echo ""
echo "Creating required directories..."
mkdir -p /app/public/uploads
echo "  ✓ /app/public/uploads"

# ── Hand off to Strapi ────────────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════"
echo "  Launching Strapi..."
echo "════════════════════════════════════════════════"
exec node_modules/.bin/strapi start
