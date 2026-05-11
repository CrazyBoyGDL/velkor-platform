# Velkor Platform - Quick Start Guide

## ✅ What's Done

### Project Structure
- ✅ Monorepo with Next.js (frontend) + Strapi (CMS)
- ✅ SOC-NOC professional theme configured
- ✅ Docker Compose setup for local development
- ✅ GitHub repository: https://github.com/CrazyBoyGDL/velkor-platform
- ✅ Main branch ready for auto-deployment to Railway

### Technology Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **CMS**: Strapi v5 (headless, non-code content management)
- **Database**: PostgreSQL
- **Deployment**: Railway (auto-sync from main branch)
- **Automation**: Make/n8n webhooks ready

### Documentation
- ✅ Architecture overview (`docs/ARCHITECTURE.md`)
- ✅ Setup guide (`docs/SETUP.md`)
- ✅ Railway deployment guide (`docs/RAILWAY_SETUP.md`)
- ✅ Non-code workflow guide (`docs/NO_CODE_WORKFLOW.md`)

---

## 🚀 Getting Started (5 Steps)

### Step 1: Install Dependencies

```bash
cd "C:\Proyectos\00Velkor"
npm install
```

This installs dependencies for both frontend and API.

### Step 2: Start Local Development

```bash
docker-compose up -d
```

Or without Docker:
- Terminal 1: `cd apps/api && npm install && npm run develop`
- Terminal 2: `cd apps/web && npm install && npm run dev`

### Step 3: Access Services

- **Frontend**: http://localhost:3000
- **Strapi Admin**: http://localhost:1337/admin
- **API**: http://localhost:1337/api

### Step 4: Create First Strapi Admin

1. Go to http://localhost:1337/admin
2. Create admin user (email & password)
3. Login to dashboard

### Step 5: Deploy to Railway

```bash
railway login
# Authenticate with GitHub
railway init --name velkor-platform
# Follow prompts to connect GitHub repo
```

Or use Railway Dashboard:
1. https://railway.app/dashboard
2. Create project → Connect GitHub repo `CrazyBoyGDL/velkor-platform`
3. Auto-deploys on `main` branch pushes

---

## 📋 Next Actions

### For Development Team

- [ ] Install dependencies: `npm install`
- [ ] Start Docker: `docker-compose up -d`
- [ ] Access Strapi Admin: http://localhost:1337/admin
- [ ] Create admin user
- [ ] Explore content types (blog, services, assessments)

### For Operations/DevOps

- [ ] Run `railway login` to authenticate
- [ ] Initialize Railway project: `railway init --name velkor-platform`
- [ ] Connect GitHub repository for auto-deployment
- [ ] Configure environment variables in Railway dashboard
- [ ] Set up custom domain (if applicable)
- [ ] Configure PostgreSQL backup strategy

### For Content Team

- [ ] Learn Strapi Admin Panel: See `docs/NO_CODE_WORKFLOW.md`
- [ ] Create first blog post
- [ ] Add services (Networks, CCTV, Cloud offerings)
- [ ] Design assessment form
- [ ] Review automated workflows in Make/n8n

---

## 🔑 Key Features

### Non-Code Content Management
All content changes made through **Strapi Admin Panel**:
- Blog posts
- Service catalog
- Assessment forms
- Quote templates
- Lead management

**No code changes needed** - perfect for non-technical team members.

### Automated Workflows
Make/n8n handles:
- **Blog published** → Auto-post to Twitter, LinkedIn, email
- **Assessment submitted** → Create CRM lead, send email, notify Slack
- **Quote generated** → Email PDF, log in system

### SOC-NOC Professional Design
- Blue/gray corporate colors
- Dashboard-ready UI
- Real-time monitoring aesthetic
- Modern, clean typography

### Production-Ready
- Docker Compose for easy setup
- PostgreSQL managed by Railway
- GitHub auto-deploy on main
- Environment variables for secrets
- TypeScript for type safety

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview |
| `docs/ARCHITECTURE.md` | System design & data flow |
| `docs/SETUP.md` | Local development setup |
| `docs/RAILWAY_SETUP.md` | Production deployment |
| `docs/NO_CODE_WORKFLOW.md` | Content management guide |

---

## 🛠️ Common Commands

### Development

```bash
# Start everything
docker-compose up -d

# Start individual services
docker-compose up strapi
docker-compose up nextjs

# View logs
docker-compose logs -f strapi
docker-compose logs -f nextjs

# Stop all
docker-compose down
```

### Database

```bash
# Backup PostgreSQL
docker exec velkor-postgres pg_dump -U velkor velkor_platform > backup.sql

# Restore backup
docker exec -i velkor-postgres psql -U velkor velkor_platform < backup.sql

# Access database shell
docker exec -it velkor-postgres psql -U velkor -d velkor_platform
```

### Deployment

```bash
# Check Railway status
railway status

# View logs
railway logs -f

# Manual deploy
railway up

# Or just push to GitHub main branch
git push origin main  # Auto-deploys!
```

---

## 🔗 Useful Links

- **Repository**: https://github.com/CrazyBoyGDL/velkor-platform
- **Railway Dashboard**: https://railway.app/dashboard
- **Strapi Documentation**: https://docs.strapi.io
- **Next.js Documentation**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## ❓ FAQ

### How do I add a new blog post?
→ Go to http://localhost:1337/admin → Blog → Create entry. See `docs/NO_CODE_WORKFLOW.md`

### How do I change the design/colors?
→ Edit `apps/web/tailwind.config.ts` for colors or `apps/web/src/app/globals.css` for styling

### How does it auto-deploy?
→ Push to main branch → GitHub notifies Railway → Automatic build & deploy. No manual steps needed!

### Can I create custom forms?
→ Yes! In Strapi Admin → Create new Assessment, configure fields visually. No code needed.

### How do I integrate with Make/n8n?
→ See `docs/NO_CODE_WORKFLOW.md` → Automation section. Get webhook URLs from Make/n8n, add to Strapi webhooks.

### What if Strapi isn't starting?
→ Run `cd apps/api && rm -rf .cache .tmp node_modules && npm install && npm run develop`

---

## 🎯 Success Criteria

- [ ] Local development runs without errors
- [ ] Strapi Admin accessible and working
- [ ] Blog post appears on Next.js frontend
- [ ] Railway auto-deployment working
- [ ] Team can manage content without code

---

## 📞 Support

Refer to:
- `docs/SETUP.md` → Troubleshooting section
- `docs/RAILWAY_SETUP.md` → Railway troubleshooting
- Strapi docs: https://docs.strapi.io
- Railway docs: https://railway.app/docs

---

## 🌐 Production URLs (Railway)

| Service | URL |
|---------|-----|
| Frontend | https://velkor-web-production.up.railway.app |
| Strapi Admin | https://velkor-api-production.up.railway.app/admin |
| API REST | https://velkor-api-production.up.railway.app/api |
| Railway Dashboard | https://railway.app/project/9f9ab588-4442-49cc-9822-e6dddcf31a03 |

**Auto-deploy**: Push to `main` branch → deploys automatically to production.

---

**Last Updated**: 2026-05-11
**Status**: ✅ Deployed to Railway — builds in progress
