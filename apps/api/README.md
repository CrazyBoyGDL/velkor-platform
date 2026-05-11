# Velkor API - Strapi CMS Backend

Headless CMS powering the Velkor Platform. Manages all content without code.

## Setup

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Database

PostgreSQL is required for production. Locally use SQLite.

```bash
# Local development (SQLite)
DATABASE_CLIENT=better-sqlite3

# Production (PostgreSQL)
DATABASE_CLIENT=postgres
DATABASE_HOST=your-db-host
DATABASE_NAME=velkor_platform
```

### Start Development

```bash
npm run develop
```

Access admin panel at: `http://localhost:1337/admin`

## API Endpoints

- `GET /api/services` - List all services
- `GET /api/blog` - List blog posts
- `POST /api/assessments` - Submit assessment
- `GET /api/quotes` - Get quotes

## Webhooks

Configure webhooks for Make/n8n automation:

- `blog.create` → Auto-publish to social media
- `assessment.submit` → Create lead in CRM
- `quote.generate` → Send via email

## Models

- **Services** - Network, CCTV, Cloud offerings
- **Blog** - Articles, tutorials
- **Assessments** - Forms for technical evaluation
- **Quotes** - Automated quote generation
- **Leads** - Sales pipeline management

## Documentation

See Strapi docs: https://docs.strapi.io
