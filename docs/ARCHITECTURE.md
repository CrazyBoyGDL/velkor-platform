# Velkor Platform - Architecture

## Overview

Velkor Platform is a **monorepo enterprise application** with clear separation of concerns:

```
velkor-platform/
├── apps/
│   ├── web/       → Next.js 14 (SOC-NOC UI)
│   └── api/       → Strapi v5 (Headless CMS)
├── automation/    → Make/n8n workflows
└── docker-compose.yml
```

## Architecture Decisions

### Frontend: Next.js 14
- **Why**: App Router, TypeScript, zero-config, excellent for SEO
- **Use case**: SOC/NOC dashboard, blog, service pages, forms
- **Styling**: Tailwind CSS with custom SOC theme

### Backend: Strapi CMS
- **Why**: Headless CMS → API-first, no-code content management
- **Use case**: 
  - Blog articles management
  - Service catalog (Networks, CCTV, Cloud)
  - Assessment forms (non-code)
  - Quote generation
  - Lead management
- **Admin Panel**: Visual, non-code content editing

### Database: PostgreSQL
- **Why**: Production-grade, relational, JSONB support for flexible data
- **Deployment**: Managed in Railway
- **Scaling**: Horizontal scaling support

### Deployment: Railway
- **Why**: Simple, auto-deploys from GitHub, native support for multi-service apps
- **Features**:
  - Auto-sync main branch
  - Environment variables management
  - PostgreSQL managed database
  - Monitoring & logs

## Data Flow

```
User Interaction
    ↓
Next.js Frontend (3000)
    ↓
Strapi API (1337)
    ↓
PostgreSQL Database
    ↓
Make/n8n Webhooks
    ↓
External Services (Emails, Social Media, CRM)
```

## Non-Code Workflow

Modifications are made in **Strapi Admin Panel** (http://localhost:1337/admin):

1. **Blog Posts**: Create/edit articles without touching code
2. **Services**: Add new service offerings (Networks, CCTV, etc.)
3. **Forms**: Design assessment forms visually
4. **Content**: All changes sync automatically to frontend

## API Endpoints

### Strapi REST API (Consumed by Next.js)

```
GET  /api/services         → All services
GET  /api/services/:id     → Single service
GET  /api/blogs            → Blog posts
GET  /api/assessments      → Assessment forms
POST /api/quotes           → Generate quote
GET  /api/leads            → Sales leads
```

### Authentication

- JWT-based (Strapi built-in)
- Roles: Admin, Moderator, Authenticated, Public
- Users-Permissions plugin for role management

## Environment Strategy

### Development
- SQLite for Strapi (lighter, faster)
- Docker Compose for entire stack
- Hot reload for code changes

### Production (Railway)
- PostgreSQL managed database
- Environment variables for secrets
- HTTPS, CDN caching, monitoring

## Scalability

**Current**: Single Strapi instance + PostgreSQL
**Future**: 
- Redis cache for Strapi
- CDN for static assets (Next.js)
- Multiple Strapi replicas
- Read replicas for PostgreSQL

## Security

- Environment variables for sensitive data
- JWT for API authentication
- Strapi role-based access control
- GitHub branch protection on main
- Railway auto-HTTPS

## Integration Points

### Make/n8n Webhooks

Strapi triggers webhooks on events:

```
Event: blog.create
  ↓
Webhook: https://hook.make.com/...
  ↓
Automation:
  - Post to Twitter/LinkedIn
  - Send notification email
  - Update CRM
  - Analytics tracking
```

### External Services

- YouTube API → Embed videos
- Email service (Sendgrid, Mailgun)
- Social media (Twitter, LinkedIn, Instagram)
- CRM (HubSpot, Pipedrive)

## Development Workflow

1. **Features**: Work in feature branches
2. **Code**: Edit Next.js or Strapi code
3. **Content**: Manage in Strapi Admin (non-code)
4. **Testing**: Local Docker Compose
5. **Deployment**: Merge to main → Railway auto-deploys

## Monitoring

- Railway logs & metrics
- Strapi built-in admin panel
- Next.js error tracking (optional: Sentry)
- Database performance (Railway dashboard)
