# verify-macau430-seo

Regression map for **macau430.com** SEO metadata only (no UI/content assertions).

## Indexable landing pages (Worker `PUBLIC_ROUTES` + static about)

| Path | Canonical | Robots (SSR shell) | In sitemap |
|------|-----------|-------------------|------------|
| `/` | `https://macau430.com/` | index, follow | yes |
| `/about` | `https://macau430.com/about` | (static `about.html`) | yes |
| `/exam` | `https://macau430.com/exam` | index, follow | yes |
| `/practice/430` | `https://macau430.com/practice/430` | index, follow | yes |
| `/practice/260` | `https://macau430.com/practice/260` | index, follow | yes |
| `/challenge` | `https://macau430.com/challenge` | index, follow | yes |

## Intentionally non-indexable (Worker `private`)

| Pattern | Robots | Canonical |
|---------|--------|-----------|
| `/quiz/:examType` (+ optional `?category=`) | noindex, follow | removed |
| `/result`, `/wrong`, `/wrong/quiz`, `/review`, `/review/session` | noindex, follow | removed |
| `/challenge/result`, `/challenge/:examType` | noindex, follow | removed |
| Unknown paths | noindex, follow | removed; HTTP 404 |

Category query variants on `/practice/*` keep canonical without query string (duplicate URL variants, not separate landing pages).

## Redirects (preserve)

- `www.macau430.com` → apex 301 (`worker/index.ts`)
- Trailing slash on known routes → normalized 301
- `/index.html` → `/`, `/about.html` → `/about` (static assets layer; expect redirect not 200 duplicate)

## Commands

```bash
npm run build
node scripts/check-routes.mjs
node scripts/check-seo.mjs
npm run dev:worker   # then spot-check SSR head tags on :8787
```

## Live curl (when Cloudflare challenge allows)

See `DEPLOY.md` §部署後驗證; use production host `https://macau430.com`.
