# Railway Deployment — Velkor Platform

## Service Map

| Service | Railway name | Root dir | URL |
|---------|-------------|----------|-----|
| PostgreSQL | `Postgres` | (managed) | `postgres.railway.internal:5432` |
| Strapi CMS | `velkor-api` | `apps/api` | `https://velkor-api-production.up.railway.app` |
| Next.js frontend | `velkor-web` | `apps/web` | `https://velkor-web-production.up.railway.app` |

Railway project: <https://railway.app/project/9f9ab588-4442-49cc-9822-e6dddcf31a03>

---

## ⚠ Required before first deploy

Strapi **will not start** without all required env vars.
The startup script validates them at launch and prints a clear error listing any that are missing.

### Step 1 — Generate secure secrets

Run this from the repo root (no external dependencies):

```bash
node scripts/generate-secrets.js
```

Example output:
```
ADMIN_JWT_SECRET=<256-bit base64url>
JWT_SECRET=<256-bit base64url>
API_TOKEN_SALT=<192-bit base64url>
TRANSFER_TOKEN_SALT=<192-bit base64url>
APP_KEYS=<key1>,<key2>,<key3>,<key4>
```

> **Each run generates new unique secrets.**
> Never commit these values. Never reuse across environments.

### Step 2 — Set env vars in Railway

Open: **Railway Dashboard → `velkor-api` service → Variables**

Paste every value from Step 1, then add:

```
# ── From Railway Postgres addon ──────────────────────────────
DATABASE_HOST=${{Postgres.PGHOST}}
DATABASE_PORT=${{Postgres.PGPORT}}
DATABASE_NAME=${{Postgres.PGDATABASE}}
DATABASE_USERNAME=${{Postgres.PGUSER}}
DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
DATABASE_SSL=true

# ── Server ───────────────────────────────────────────────────
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# ── CORS ─────────────────────────────────────────────────────
# Set to the actual velkor-web Railway URL (or custom domain)
FRONTEND_URL=https://velkor-web-production.up.railway.app
```

> **Railway reference variables** (e.g. `${{Postgres.PGHOST}}`) are resolved at
> runtime from the linked Postgres service. Use them — do not hardcode IPs.

### Step 3 — Set env vars for Next.js

Open: **Railway Dashboard → `velkor-web` service → Variables**

```
# ── API ──────────────────────────────────────────────────────
STRAPI_URL=https://velkor-api-production.up.railway.app
NODE_ENV=production

# ── Optional features (leave blank to disable) ───────────────
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
NEXT_PUBLIC_CALENDLY_URL=
```

---

## Required env var reference

### `velkor-api` (Strapi)

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_JWT_SECRET` | ✅ | Admin panel JWT signing key |
| `JWT_SECRET` | ✅ | users-permissions plugin JWT key |
| `API_TOKEN_SALT` | ✅ | API token hashing salt |
| `TRANSFER_TOKEN_SALT` | ✅ | Transfer token hashing salt |
| `APP_KEYS` | ✅ | 4 × comma-separated Koa session keys |
| `DATABASE_HOST` | ✅ | PostgreSQL host |
| `DATABASE_PORT` | ✅ | PostgreSQL port (usually 5432) |
| `DATABASE_NAME` | ✅ | Database name |
| `DATABASE_USERNAME` | ✅ | Database user |
| `DATABASE_PASSWORD` | ✅ | Database password |
| `DATABASE_SSL` | ✅ | `true` on Railway |
| `FRONTEND_URL` | ✅ | Next.js URL for CORS allow-list |
| `HOST` | — | Bind address, default `0.0.0.0` |
| `PORT` | — | HTTP port, default `1337` |
| `NODE_ENV` | — | Set to `production` |

### `velkor-web` (Next.js)

| Variable | Required | Description |
|----------|----------|-------------|
| `STRAPI_URL` | ✅ | Private Strapi base URL (not browser-exposed) |
| `NODE_ENV` | — | Set to `production` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | optional | Enables WhatsApp CTA (e.g. `521XXXXXXXXXX`) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | optional | Enables Plausible analytics |
| `NEXT_PUBLIC_CALENDLY_URL` | optional | Enables Calendly booking button |

---

## Startup validation

`apps/api/start.sh` validates all required env vars at the **shell level** before
Strapi initialises. If any are missing it prints exactly which ones and exits 1:

```
╔══════════════════════════════════════════════╗
║  STARTUP BLOCKED — Missing env vars          ║
╚══════════════════════════════════════════════╝
  ✗ JWT_SECRET
  ✗ APP_KEYS

  → Generate secrets : node scripts/generate-secrets.js
  → Set in Railway   : Dashboard → Service → Variables
```

Additionally, `config/server.js`, `config/admin.js` and `config/plugins.js` each
throw at config-load time if their respective secrets are absent — providing a
second defence layer inside Strapi itself.

---

## Auto-deployment workflow

```
git push origin main
        ↓
Railway detects changes (GitHub webhook)
        ↓
Docker build  →  npm run build  (Strapi admin panel)
        ↓
Container start  →  sh ./start.sh
        ↓
Pre-flight env var check  →  Strapi start
```

Both services deploy in parallel. Strapi usually takes ~90 s to build; Next.js ~60 s.

---

## Troubleshooting

### Strapi startup failure

Look for this pattern in Railway logs:
```
STARTUP BLOCKED — Missing env vars
  ✗ <VAR_NAME>
```
→ Run `node scripts/generate-secrets.js` and set the listed variable(s) in Railway.

### Database connection refused

1. Confirm the Postgres addon is **running** in the Railway dashboard.
2. Verify `DATABASE_HOST` uses the Railway reference variable (`${{Postgres.PGHOST}}`), not a hardcoded IP.
3. Confirm `DATABASE_SSL=true` is set (Railway Postgres requires SSL).

### CORS errors from Next.js

Ensure `FRONTEND_URL` in the Strapi service matches the exact origin of your
Next.js service (protocol + domain, no trailing slash).

For multiple origins (e.g., preview + production) use a comma-separated list:
```
FRONTEND_URL=https://velkor.mx,https://velkor-web-production.up.railway.app
```

### Rotating secrets

To rotate secrets (e.g., after suspected leak):
1. Generate new values: `node scripts/generate-secrets.js`
2. Update values in Railway → Variables.
3. Redeploy the `velkor-api` service.

> Rotating `JWT_SECRET` logs out all Strapi users.
> Rotating `APP_KEYS` invalidates all browser sessions.
> Rotating `ADMIN_JWT_SECRET` logs out all Strapi admins.

---

## Railway CLI quick reference

```bash
railway login                      # authenticate
railway status                     # show current project/service
railway logs --service velkor-api  # tail Strapi logs
railway logs --service velkor-web  # tail Next.js logs
railway run --service velkor-api -- node scripts/generate-secrets.js
```
