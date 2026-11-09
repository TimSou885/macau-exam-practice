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

## JSON-LD (SSR shell)

| Script `data-seo` | Routes | Notes |
|-------------------|--------|-------|
| `site` | all shells | WebSite + WebApplication (site origin URLs — not page URL) |
| `homepage-faq` | `/` only | FAQPage; removed on other routes (content not on those pages) |

## Commands

```bash
npm run build
npm run check:routes
npm run check:seo
npm run test:seo          # rewriteShell HTMLRewriter regression (Worker runtime)
npm run dev:worker        # optional: npm run smoke:hydrated-head (needs Playwright)
```

## Live curl (when Cloudflare challenge allows)

See `DEPLOY.md` §部署後驗證; use production host `https://macau430.com`.
