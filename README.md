# Rendr

HTML-to-PDF as a service. One API call converts your HTML templates into pixel-perfect PDFs. Async jobs, webhooks, signed download URLs — all included.

## Local Development

### Prerequisites
- Node.js 20+
- Docker + Docker Compose (for Postgres)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in values
cp .env.example .env
# Edit DATABASE_URL, NEXTAUTH_SECRET (must be 32+ chars), NEXTAUTH_URL

# 3. Start Postgres
docker compose up postgres -d

# 4. Run migrations and generate Prisma client
npm run db:migrate
npm run db:generate

# 5. Seed demo user (demo@rendr.dev / demo1234)
npm run db:seed

# 6. Start the web app (terminal 1)
npm run dev

# 7. Start the PDF worker (terminal 2)
npm run worker
```

App runs at http://localhost:3000

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | required |
| `NEXTAUTH_SECRET` | Session encryption secret (32+ chars) | required |
| `NEXTAUTH_URL` | App base URL | `http://localhost:3000` |
| `API_RATE_LIMIT_PER_MINUTE` | API requests per key per minute | `60` |
| `STORAGE_MODE` | Storage backend (`local`) | `local` |
| `STORAGE_LOCAL_DIR` | Directory for PDF files | `/data` |
| `WEBHOOK_RETRY_ATTEMPTS` | Max webhook delivery attempts | `3` |
| `WEBHOOK_RETRY_DELAY_MS` | Initial backoff delay (ms) | `1000` |
| `PLAYWRIGHT_TIMEOUT_MS` | Chromium page timeout (ms) | `30000` |

### npm Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run worker` | Start PDF worker process |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate` | Apply migrations (dev) |
| `npm run db:seed` | Seed demo user |

---

## Production Deployment (Vultr VPS)

### Prerequisites
- Ubuntu 22.04 VPS
- Domain pointed at VPS IP
- SSH access as root or sudo user

### 1. Initial Server Setup

```bash
apt update && apt upgrade -y

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Docker
apt install -y docker.io docker-compose-plugin
systemctl enable --now docker

# Nginx + Certbot
apt install -y nginx certbot python3-certbot-nginx

# PM2
npm install -g pm2
```

### 2. Clone Repository

```bash
mkdir -p /var/www && cd /var/www
git clone https://github.com/alexthecreator0001/rendr.git
cd rendr
```

### 3. Configure Environment

```bash
cp .env.example .env
nano .env
```

Set these values:
```env
DATABASE_URL=postgresql://rendr:STRONG_PASSWORD@localhost:5432/rendr
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=https://rendrpdf.com
STORAGE_LOCAL_DIR=/var/www/rendr/data
```

### 4. Start Postgres

```bash
docker run -d \
  --name rendr-postgres \
  --restart unless-stopped \
  -e POSTGRES_USER=rendr \
  -e POSTGRES_PASSWORD=STRONG_PASSWORD \
  -e POSTGRES_DB=rendr \
  -p 127.0.0.1:5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16-alpine
```

### 5. Install Dependencies and Build

```bash
cd /var/www/rendr
npm ci
npx prisma generate
npm run db:migrate -- --name init
npm run db:seed
npm run build
```

### 6. Create Storage Directory

```bash
mkdir -p /var/www/rendr/data/pdfs
```

### 7. Install Playwright Chromium

```bash
npx playwright install chromium
npx playwright install-deps chromium
```

### 8. Configure Nginx

```bash
cp nginx/rendr.conf /etc/nginx/sites-available/rendrpdf.com
ln -s /etc/nginx/sites-available/rendrpdf.com /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
certbot --nginx -d rendrpdf.com -d www.rendrpdf.com --non-interactive --agree-tos -m your@email.com
systemctl restart nginx
```

### 9. Start with PM2

```bash
cd /var/www/rendr
pm2 start npm --name "rendr-web" -- start
pm2 start npm --name "rendr-worker" -- run worker
pm2 save
pm2 startup
# Run the command it outputs
```

### 10. Update After Code Changes

After each `git push`, run on server:

```bash
cd /var/www/rendr && git pull && npm ci && npx prisma generate && npx prisma migrate deploy && npm run build && pm2 restart rendr-web && pm2 restart rendr-worker
```

### 11. Monitoring

```bash
pm2 logs rendr-web
pm2 logs rendr-worker
pm2 status
curl https://rendrpdf.com/api/v1/health
```

### 12. Firewall

```bash
ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw enable
```

---

## API Reference

Base URL: `https://rendrpdf.com/api/v1`

All endpoints (except `/health` and `/files/:token`) require:
```
Authorization: Bearer rk_live_<your-api-key>
```

### POST /convert

Synchronous — waits up to 8s, returns 200 (done) or 202 (queued).

```json
{
  "input": {
    "type": "html",
    "content": "<h1>Hello {{name}}</h1>",
    "variables": { "name": "World" }
  },
  "options": { "format": "A4" }
}
```

### POST /convert-async

Always returns 202 immediately. Poll `/jobs/:id` for status.

### GET /jobs/:id

Returns job status + `pdf_url` when `status: "succeeded"`.

### GET /files/:token

Download rendered PDF. No auth required — token is the credential.

### GET/POST /templates, GET/PUT/DELETE /templates/:id

Manage reusable HTML templates.

### GET/POST /webhooks, GET/PUT/DELETE /webhooks/:id

Configure webhook endpoints. Payloads signed with `X-Rendr-Signature: sha256=<hmac>`.

### GET /usage

Returns `{ today, last_7_days, last_30_days }` request counts.

---

## Architecture

```
rendr/
├── app/
│   ├── (public)/       # Marketing pages
│   ├── (auth)/         # Login / register
│   ├── app/            # Dashboard (/app/*)
│   ├── docs/           # Documentation
│   └── api/
│       ├── auth/       # NextAuth handlers
│       ├── v1/         # Public API
│       └── dashboard/  # Internal dashboard API
├── components/
├── lib/
│   ├── db.ts           # Prisma singleton
│   ├── api-key.ts      # Key generation + SHA-256
│   ├── queue.ts        # pg-boss singleton
│   ├── storage.ts      # Local disk PDF storage
│   ├── webhook.ts      # HMAC webhook delivery
│   ├── rate-limit.ts   # In-memory rate limiter
│   └── require-api-key.ts
├── worker/             # PDF worker (separate process)
│   ├── index.ts        # pg-boss entry
│   └── processor.ts    # Playwright PDF generation
└── prisma/
    └── schema.prisma
```

**Web process** — HTTP only, no Playwright.
**Worker process** — consumes `pdf-conversion` queue, runs Playwright Chromium.

---

## Webhook Verification

```javascript
const crypto = require("crypto");

function verifySignature(secret, rawBody, signature) {
  const expected = "sha256=" + crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
```
