#!/bin/sh
set -e

echo "=== Velkor API Starting ==="
echo "NODE_ENV: $NODE_ENV"
echo "DATABASE_URL set: ${DATABASE_URL:+YES}"
echo "DATABASE_CLIENT: $DATABASE_CLIENT"
echo ""

echo "=== Verifying config/database.js ==="
node -e "
  try {
    const fn = require('./config/database.js')
    const env = (k, d) => process.env[k] !== undefined ? process.env[k] : d
    env.int = (k, d) => parseInt(process.env[k] || d)
    env.bool = (k, d) => process.env[k] !== undefined ? process.env[k] === 'true' : d
    env.array = (k, d) => process.env[k] ? process.env[k].split(',') : d
    const cfg = fn({ env })
    console.log('Config loaded OK:', JSON.stringify({ client: cfg.connection.client, hasConnection: !!cfg.connection.connection }, null, 2))
  } catch(e) {
    console.error('Config ERROR:', e.message)
    process.exit(1)
  }
"

echo ""
echo "=== Creating required directories ==="
mkdir -p /app/public/uploads

echo "=== Starting Strapi ==="
exec npm run start
