# Non-Code Workflow - Velkor Platform

This guide explains how to manage all content WITHOUT editing code.

## Overview

All modifications are made through **Strapi Admin Panel** at `http://localhost:1337/admin`

```
Strapi Admin Panel (Visual Editor)
    ↓
Content API
    ↓
Next.js Frontend (Auto-updates)
```

## Accessing Strapi Admin

### Local Development
```
http://localhost:1337/admin
```

### Production (Railway)
```
https://api.velkor.system/admin
```

## Creating Content

### 1. Blog Posts

**Path**: Strapi Admin → Content Manager → Blog

1. Click "Create new entry"
2. Fill in:
   - **Title**: Post title
   - **Slug**: URL-friendly name (auto-generated)
   - **Description**: Short summary
   - **Content**: Full article (rich text editor)
   - **Featured Image**: Upload cover image
   - **Status**: Draft or Published
   - **YouTube Video** (optional): Video ID

3. Click "Save" → "Publish"

Changes appear immediately at `/blog`

### 2. Services

**Path**: Strapi Admin → Content Manager → Services

Services are your offerings: Networks, CCTV, Cloud, etc.

1. Click "Create new entry"
2. Fill in:
   - **Name**: Service name (e.g., "Microsoft 365 Setup")
   - **Category**: Networks / CCTV / Infrastructure / Cloud
   - **Description**: What you offer
   - **Features**: List key features
   - **Icon**: Upload or select icon
   - **Pricing** (optional): Base price for estimates

3. Click "Save" → "Publish"

**Used for**: Service catalog page, quote generation

### 3. Assessment Forms

**Path**: Strapi Admin → Content Manager → Assessments

Technical evaluation forms for clients.

1. Click "Create new entry"
2. Configure form:
   - **Title**: "Network Infrastructure Assessment"
   - **Questions**: 
     - Add questions with:
       - Question text
       - Type: Text / Radio / Checkbox / Dropdown
       - Required: Yes/No
   - **Success Message**: Thank you message after submission

3. Click "Save" → "Publish"

**When used**: Client fills form → webhook triggers Make/n8n → creates lead

### 4. Quote Templates

**Path**: Strapi Admin → Content Manager → Quotes

Define quote generation templates.

1. Create entry:
   - **Title**: "Network Upgrade Quote"
   - **Service**: Link to service
   - **Base Price**: Starting price
   - **Line Items**: Add items with pricing
   - **Discount Rules**: Quantity discounts

2. Publish

**When used**: Assessment → Auto-generate quote → Email to client

## Managing Media

### Upload Images/Videos

1. Go to Strapi Admin → Media Library
2. Drag-drop files
3. Organize in folders
4. Use in content via "Select from Media Library"

### YouTube Videos

Instead of uploading, use YouTube IDs:

1. Get YouTube video ID: `https://youtube.com/watch?v=` **dQw4w9WgXcQ**
2. In blog post, add: `dQw4w9WgXcQ`
3. Frontend automatically embeds video

## Publishing Workflow

### Draft to Published

1. Edit content
2. Click "Save as draft"
3. Preview changes
4. When ready: Click "Publish"

### Unpublish (Remove from Site)

1. Open published content
2. Click "Unpublish"
3. Content removed from public site (kept in drafts)

### Schedule Publishing

1. Create/edit content
2. Set "Publish at" date/time
3. Strapi auto-publishes at scheduled time

## Automation with Make/n8n

### Blog Post Published

When you publish a blog post:

**Webhook triggers automatically:**
```
Webhook: blog.create
    ↓
Make/n8n workflow
    ↓
Actions:
  - Share to Twitter
  - Post to LinkedIn
  - Send to email list
  - Update Discord
```

**No action needed** - happens automatically!

### Assessment Submitted

When a client submits an assessment:

```
Form submission
    ↓
Webhook: assessment.submit
    ↓
Make/n8n workflow
    ↓
Actions:
  - Create lead in HubSpot/Pipedrive
  - Send confirmation email
  - Notify team on Slack
  - Generate quote
```

### Quote Generated

```
Quote creation
    ↓
Webhook: quote.create
    ↓
Make/n8n workflow
    ↓
Actions:
  - Email PDF to client
  - Log in Salesforce
  - Notify sales team
```

## Editing Content Types (Advanced Non-Code)

If you need new fields without coding:

1. Strapi Admin → Content Manager → Select content type
2. Click ⚙️ Settings
3. "Edit fields" 
4. Add new field:
   - Name: e.g., "Phone Number"
   - Type: Text / Email / Number / etc.
   - Required: Yes/No
5. Save → Backend updates automatically

**Example**: Add phone field to Assessment:
- Field name: `clientPhone`
- Type: Email
- Click Save
- Forms now capture phone number

## Managing Users & Permissions

**Path**: Strapi Admin → Settings → Users & Roles

### Create Team Member

1. Click "Add user"
2. Email: their email
3. Role: 
   - **Admin**: Full access
   - **Editor**: Can create/edit content
   - **Moderator**: Can publish content
   - **Viewer**: Read-only

3. Send invite link → they set password

### Role Permissions

1. Click "Roles"
2. Select role (e.g., "Editor")
3. Configure what they can:
   - Create content
   - Edit content
   - Delete content
   - Manage users
   - Access webhooks

## Common Tasks Checklist

### Weekly Content Updates
- [ ] Write 1-2 blog posts
- [ ] Update service descriptions if pricing changed
- [ ] Check submitted assessments in Make/n8n

### Monthly
- [ ] Review analytics (blog views, form submissions)
- [ ] Update service offerings
- [ ] Check social media posts from automation

### Quarterly
- [ ] Review assessment forms → update questions
- [ ] Update quote templates → adjust pricing
- [ ] Review leads generated from assessments

## Troubleshooting

### Changes not showing on website

1. Check content is "Published" (not Draft)
2. Refresh browser (Ctrl+F5)
3. Check Next.js frontend is running
4. View logs: `railway logs`

### Form submissions not triggering emails

1. Check webhook is configured in Make/n8n
2. Verify email service credentials
3. Check Make/n8n scenario is "ON"
4. Test webhook: Make/n8n dashboard → Test tab

### Images not loading

1. Check image uploaded in Media Library
2. Verify URL in content preview
3. Check image file size < 5MB
4. Re-upload if needed

## Next Steps

1. [ ] Access Strapi Admin at http://localhost:1337/admin
2. [ ] Create first admin user
3. [ ] Add blog post
4. [ ] Add services
5. [ ] Create assessment form
6. [ ] Setup Make/n8n webhooks
7. [ ] Test blog publication → social media automation
