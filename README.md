# Velkor Platform

Enterprise platform for infrastructure, networking, CCTV, and cloud services (Microsoft 365, Intune, Entra ID).

**SOC/NOC Centered Architecture** - Modern operations center interface with real-time monitoring, service management, assessments, and quote automation.

## 🏗️ Architecture

```
velkor-platform/
├── apps/
│   ├── web/          # Next.js frontend (SOC-NOC UI)
│   └── api/          # Strapi CMS + LMS backend
├── automation/       # Make/n8n workflows
├── docs/             # Technical documentation
└── docker-compose.yml
```

## 🚀 Quick Start

### Local Development

```bash
npm install
npm run dev
```

Starts:
- Frontend: http://localhost:3000
- Strapi: http://localhost:1337/admin

### With Docker

```bash
docker-compose up -d
```

## 📦 Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Strapi v4 (Headless CMS)
- **Database**: PostgreSQL
- **Deployment**: Railway
- **Automation**: Make / n8n webhooks
- **Design**: SOC-NOC theme (professional, corporate)

## 🛠️ Features

- [ ] Blog system (Strapi CMS)
- [ ] Service catalog (Networks, CCTV, Cloud)
- [ ] Assessment forms (non-code)
- [ ] Quote generation & automation
- [ ] YouTube video integration
- [ ] Social media automation (Make/n8n)
- [ ] Dashboard & monitoring
- [ ] Lead management

## 📋 Documentation

See `/docs` for:
- Architecture decisions
- Deployment guides
- API documentation
- Non-code workflow setup

## 🔐 Security

- Environment variables for sensitive data
- PostgreSQL secured in Railway
- Strapi role-based access control
- GitHub branch protection on main
