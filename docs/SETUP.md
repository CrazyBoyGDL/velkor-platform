# Setup Guide - Velkor Platform

## Prerequisites

- Node.js 20.x or 24.x (not 25.x for Strapi compatibility)
- Docker & Docker Compose
- Git
- Railway CLI (for deployment)

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/velkor-platform.git
cd velkor-platform
```

### 2. Install Dependencies

```bash
npm install
```

This installs dependencies for both `apps/web` and `apps/api` (monorepo).

### 3. Environment Variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

For local development, defaults are fine.

### 4. Start Development Stack

#### Option A: Docker Compose (Recommended)

```bash
docker-compose up -d
```

This starts:
- **Next.js**: http://localhost:3000
- **Strapi**: http://localhost:1337
- **API**: http://localhost:1337/api
- **Admin**: http://localhost:1337/admin
- **PostgreSQL**: localhost:5432

#### Option B: Local (Without Docker)

**Terminal 1 - Strapi:**
```bash
cd apps/api
npm install
npm run develop
```

**Terminal 2 - Next.js:**
```bash
cd apps/web
npm install
npm run dev
```

Note: Requires PostgreSQL running locally on port 5432.

## First Time Setup

### Strapi Admin

1. Visit http://localhost:1337/admin
2. Create initial admin user
3. Configure:
   - Email provider (optional)
   - Webhooks for Make/n8n
   - Content types (pre-configured)

### Next.js Configuration

1. Visit http://localhost:3000
2. Check that API connection works (should see data)
3. Customize colors in `tailwind.config.ts` if needed

## Development Workflow

### Adding Content (Non-Code)

1. Open Strapi Admin: http://localhost:1337/admin
2. Create/edit:
   - Blog posts
   - Services
   - Assessment forms
   - Quotes
3. Changes sync immediately to frontend

### Adding Code Features

1. Create feature branch: `git checkout -b feature/my-feature`
2. Edit files in `apps/web` or `apps/api`
3. Test locally
4. Commit & push
5. Create PR
6. Merge to main → Railway auto-deploys

### Database

#### Migrations (Strapi)

Strapi auto-generates migrations:

```bash
cd apps/api
npm run strapi generate:migration create_my_table
npm run strapi migrate:latest
```

## Deployment to Railway

### First Time Setup

```bash
# Login to Railway
railway login

# Initialize project
railway init

# Add services
railway add postgres
railway up
```

### Connect GitHub

1. Go to Railway dashboard
2. Select project
3. Settings → GitHub Repository
4. Enable auto-deploy on main branch

### Environment Variables in Railway

1. Dashboard → Project → Variables
2. Add:
   ```
   DATABASE_HOST=your-railway-postgres-host
   DATABASE_PASSWORD=generated
   JWT_SECRET=generate-strong-key
   API_URL=https://your-domain.railway.app
   ```

### Deploy

```bash
railway up
```

Or push to main branch for auto-deployment.

## Troubleshooting

### Strapi won't start

```bash
# Clear Strapi cache
cd apps/api
rm -rf .cache .tmp

# Reinstall
npm install
npm run develop
```

### Next.js API errors

Check `.env` and ensure `NEXT_PUBLIC_API_URL` matches Strapi URL:

```bash
# Local
NEXT_PUBLIC_API_URL=http://localhost:1337

# Production
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

### Database connection issues

```bash
# Check PostgreSQL running
docker ps | grep postgres

# Inspect logs
docker logs velkor-postgres

# Reset database (careful!)
docker-compose down -v
docker-compose up -d
```

### Port already in use

```bash
# Change in docker-compose.yml or .env
# Or kill process:
lsof -i :3000  # Find process
kill -9 <PID>
```

## Database Backup/Restore

### Backup

```bash
docker exec velkor-postgres pg_dump -U velkor velkor_platform > backup.sql
```

### Restore

```bash
docker exec -i velkor-postgres psql -U velkor velkor_platform < backup.sql
```

## Next Steps

- [ ] Configure Strapi content types in admin
- [ ] Add your first blog post
- [ ] Set up Make/n8n webhooks
- [ ] Connect social media accounts
- [ ] Deploy to Railway
- [ ] Configure domain & SSL
